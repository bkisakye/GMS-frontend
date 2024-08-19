import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";
import { Accordion, Card, Form, Button } from "react-bootstrap";

const ApplicationPage = () => {
  const { grantName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({ answers: [] });
  const location = useLocation();
  const grantId = location.state?.grantId;
  const [showModal, setShowModal] = useState(false)

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchQuestionsAndResponses();
  }, [grantId]);

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
    const response = await fetchWithAuth(`/api/grants/responses/${grantId}/`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    });

    if (response.ok) {
      console.log("Application submitted successfully!", response);
    } else {
      console.error("Error submitting application:", response);
    }
  } catch (error) {
    console.error("Error submitting application:", error);
  }
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
                                  checked={isChecked ? true : false}
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
                                name={question.id}
                                value={choice}
                                checked={
                                  answers.answers.find(
                                    (answer) =>
                                      answer.question_id === question.id &&
                                      answer.answer === choice
                                  )
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleChange(e, question)}
                              />
                            ))}
                          </div>
                        )}
                        {question.question_type === "table" && (
                          <table className="table table-bordered">
                            <thead className="table-dark">
                              <tr>
                                {question.choices.map((column) => (
                                  <th key={column}>{column}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({
                                length: question.number_of_rows,
                              }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                  {question.choices.map((column) => (
                                    <td key={column}>
                                      <Form.Control
                                        type="text"
                                        value={
                                          answers.answers.find(
                                            (answer) =>
                                              answer.question_id ===
                                                question.id &&
                                              answer.choice_answers[rowIndex] &&
                                              answer.choice_answers[rowIndex][
                                                column
                                              ]
                                          )?.choice_answers[rowIndex][column] ||
                                          ""
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
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </Form.Group>
                    ))}
                  </div>
                ))}
              </Accordion.Body>
            </Card>
          </Accordion>
        ))}
        {/* <input type="file"  */}
        <Button type="submit" variant="primary" style={submitButtonStyle}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ApplicationPage;
