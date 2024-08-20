import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";
import { Accordion, Card, Form, Button, Modal } from "react-bootstrap";
// import { useUser } from "../../../UserContext.js";

const ApplicationPage = () => {
  const { grantName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({ answers: [] });
  const location = useLocation();
  const grantId = location.state?.grantId;
  const [showModal, setShowModal] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [files, setFiles] = useState({});
  const[choicesData, setChoicesData] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    const fetchQuestionsAndResponses = async () => {
      try {
        // Fetch questions
        const questionsResponse = await fetchWithAuth("/api/grants/questions/");
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        // Fetch existing responses
        const responsesResponse = await fetchWithAuth(
          `/api/grants/responses/${grantId}/`
        );
        const responsesData = await responsesResponse.json();

        // Initialize form with responses
        const initialAnswers = responsesData.map((response) => ({
          question_id: response.question.id,
          answer: response.answer,
          choice_answers: response.choices || [],
          question_type: response.question.question_type,
          number_of_rows: response.question.number_of_rows || 0,
        }));

        // Update state
        setAnswers({ answers: initialAnswers });
        setApplicationId(responsesData.application_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchQuestionsAndResponses();
  }, [grantId]);

  useEffect(() => {
    if (applicationId && userId) {
      const fetchChoicesData = async () => {
        try {
          const choicesResponse = await fetchWithAuth(
            `/api/grants/filtered-responses/?application_id=${applicationId}&user_id=${userId}`
          );
          const choicesData = await choicesResponse.json();

          const choicesMap = choicesData.reduce((acc, item) => {
            acc[item.question] = item.choices;
            return acc;
          }, {});

          setChoicesData(choicesMap);
        } catch (error) {
          console.error("Error fetching choices data:", error);
        }
      };

      fetchChoicesData();
    }
  }, [applicationId, userId]);

  const handleChange = (e, question, column = null, rowIndex = null) => {
    const { value, type, checked } = e.target;
    const questionId = question.id;
    const questionType = question.question_type;

    // Find the existing answer for the given questionId
    const existingAnswerIndex = answers.answers.findIndex(
      (answer) => answer.question_id === questionId
    );

    if (existingAnswerIndex === -1) {
      // New answer
      if (questionType === "table") {
        const newAnswer = {
          question_id: questionId,
          answer: null,
          choice_answers: [{ [column]: value }],
          question_type: questionType,
          number_of_rows: question.number_of_rows,
        };

        for (let i = 0; i < question.number_of_rows; i++) {
          if (i !== rowIndex) {
            newAnswer.choice_answers.push({});
          }
        }

        setAnswers((prevAnswers) => ({
          answers: [...prevAnswers.answers, newAnswer],
        }));
      } else if (questionType === "checkbox") {
        setAnswers((prevAnswers) => ({
          answers: [
            ...prevAnswers.answers,
            {
              question_id: questionId,
              answer: null,
              choice_answers: checked ? [{ check: value }] : [],
              question_type: questionType,
            },
          ],
        }));
      } else {
        setAnswers((prevAnswers) => ({
          answers: [
            ...prevAnswers.answers,
            {
              question_id: questionId,
              answer: value,
              choice_answers: null,
              question_type: questionType,
            },
          ],
        }));
      }
    } else {
      // Update existing answer
      if (questionType === "table") {
        setAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers.answers];
          updatedAnswers[existingAnswerIndex].choice_answers[rowIndex] = {
            ...updatedAnswers[existingAnswerIndex].choice_answers[rowIndex],
            [column]: value,
          };
          return { answers: updatedAnswers };
        });
      } else if (questionType === "checkbox") {
        setAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers.answers];
          const choiceIndex = updatedAnswers[
            existingAnswerIndex
          ].choice_answers.findIndex((choice) => choice.check === value);

          if (checked) {
            if (choiceIndex === -1) {
              updatedAnswers[existingAnswerIndex].choice_answers.push({
                check: value,
              });
            }
          } else {
            if (choiceIndex !== -1) {
              updatedAnswers[existingAnswerIndex].choice_answers.splice(
                choiceIndex,
                1
              );
            }
          }
          return { answers: updatedAnswers };
        });
      } else {
        setAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers.answers];
          updatedAnswers[existingAnswerIndex].answer = value;
          return { answers: updatedAnswers };
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", answers);

    const method = answers.answers.length > 0 ? "PATCH" : "POST"; // Use PATCH if answers already exist

    try {
      const response = await fetchWithAuth(
        `/api/grants/responses/${grantId}/`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answers),
        }
      );

      if (response.ok) {
        console.log("Application submitted successfully!", response);
        const responseData = await response.json();
        setApplicationId(responseData.application_id);
        setShowModal(true); // This will trigger the modal to open

        console.log(
          "Application ID after submission:",
          responseData.application_id
        );
        console.log("User ID:", userId);
      } else {
        console.error("Error submitting application:", response);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };






const handleFileUpload = async () => {
  if (!applicationId) return;

  const formData = new FormData();
  Object.keys(files).forEach((key) => {
    const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];
    fileArray.forEach((file) => formData.append("documents", file)); // Use 'documents' key
  });

  try {
    const token = localStorage.getItem("accessToken");
    const uploadResponse = await fetch(
      `http://127.0.0.1:8000/api/grants/applications/${applicationId}/documents/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (uploadResponse.ok) {
      console.log("Files uploaded successfully!");
    } else {
      console.error("Error uploading files:", await uploadResponse.json()); // Print response body for debugging
    }
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};




const handleFileChange = (event, choice) => {
  const { files } = event.target;
  setFiles((prevFiles) => ({
    ...prevFiles,
    [choice]: Array.from(files), // Convert FileList to Array
  }));
};




  const groupedQuestions = questions.reduce((acc, question) => {
    const sectionTitle = question.section?.title || "Uncategorized";
    const subSectionTitle = question.sub_section?.title || "General";

    if (!acc[sectionTitle]) acc[sectionTitle] = {};
    if (!acc[sectionTitle][subSectionTitle])
      acc[sectionTitle][subSectionTitle] = [];

    acc[sectionTitle][subSectionTitle].push(question);
    return acc;
  }, {});

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto", // Center the form horizontally
    padding: "20px",
  };

  const headerStyle = {
    backgroundColor: "gray",
    color: "black",
    padding: "1px",
  };

  const submitButtonStyle = {
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <h1 className="mb-4">
        Application for Grant: {decodeURIComponent(grantName)}
      </h1>
      <Form onSubmit={handleSubmit}>
        {Object.keys(groupedQuestions).map((section) => (
          <Accordion key={section} defaultActiveKey="0" className="mb-4">
            <Card>
              <Accordion.Header eventKey="0" style={headerStyle}>
                <h3>{section}</h3>
              </Accordion.Header>
              <Accordion.Body>
                {Object.keys(groupedQuestions[section]).map((subSection) => (
                  <div key={subSection} className="mb-4">
                    <h5 className="mb-3">{subSection}</h5>
                    {groupedQuestions[section][subSection].map((question) => (
                      <Form.Group key={question.id} className="mb-4">
                        <Form.Label>{question.text}</Form.Label>
                        {question.question_type === "text" && (
                          <Form.Control
                            as="textarea"
                            value={
                              answers.answers.find(
                                (answer) => answer.question_id === question.id
                              )?.answer || ""
                            }
                            onChange={(e) => handleChange(e, question)}
                            rows={3}
                          />
                        )}
                        {question.question_type === "number" && (
                          <Form.Control
                            type="number"
                            value={
                              answers.answers.find(
                                (answer) => answer.question_id === question.id
                              )?.answer || ""
                            }
                            onChange={(e) => handleChange(e, question)}
                          />
                        )}
                        {question.question_type === "date" && (
                          <Form.Control
                            type="date"
                            value={
                              answers.answers.find(
                                (answer) => answer.question_id === question.id
                              )?.answer || ""
                            }
                            onChange={(e) => handleChange(e, question)}
                          />
                        )}
                        {question.question_type === "checkbox" && (
                          <div>
                            {question.choices?.map((choice, index) => {
                              const isChecked = answers.answers.find(
                                (answer) =>
                                  answer.question_id === question.id &&
                                  answer.choice_answers.some(
                                    (ca) => ca.check === choice
                                  )
                              );
                              return (
                                <Form.Check
                                  key={index}
                                  type="checkbox"
                                  label={choice}
                                  value={choice}
                                  checked={isChecked}
                                  onChange={(e) => handleChange(e, question)}
                                />
                              );
                            })}
                          </div>
                        )}
                        {question.question_type === "radio" && (
                          <div>
                            {question.choices?.map((choice, index) => (
                              <Form.Check
                                key={index}
                                type="radio"
                                label={choice}
                                value={choice}
                                checked={
                                  answers.answers.find(
                                    (answer) =>
                                      answer.question_id === question.id
                                  )?.answer === choice
                                }
                                onChange={(e) => handleChange(e, question)}
                              />
                            ))}
                          </div>
                        )}
                        {question.question_type === "table" && (
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  {question.choices.map((column, index) => (
                                    <th key={index}>{column}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {Array.from({
                                  length: question.number_of_rows,
                                }).map((_, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {question.choices.map(
                                      (column, colIndex) => (
                                        <td key={colIndex}>
                                          <Form.Control
                                            type="text"
                                            value={
                                              answers.answers.find(
                                                (answer) =>
                                                  answer.question_id ===
                                                  question.id
                                              )?.choice_answers[rowIndex]?.[
                                                column
                                              ] || ""
                                            }
                                            onChange={(e) =>
                                              handleChange(
                                                e,
                                                question,
                                                column,
                                                rowIndex
                                              )
                                            }
                                          />
                                        </td>
                                      )
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Form.Group>
                    ))}
                  </div>
                ))}
              </Accordion.Body>
            </Card>
          </Accordion>
        ))}
        <Button
          variant="primary"
          type="submit"
          style={submitButtonStyle}
          onClick={() => {
            if (applicationId && files.length > 0) {
              handleFileUpload(applicationId, files);
            }
          }}
        >
          Submit
        </Button>
      </Form>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        onEnter={() => console.log("Choices Data:", choicesData)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Please Upload The Required Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(choicesData).length > 0 ? (
              Object.keys(choicesData).map((questionId) => (
                <div key={questionId}>
                  {choicesData[questionId].map((choice, index) => (
                    <Form.Group key={index} className="mb-3">
                      <Form.Label>{choice}</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, choice)}
                      />
                    </Form.Group>
                  ))}
                </div>
              ))
            ) : (
              <p>No choices available.</p>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFileUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplicationPage;
