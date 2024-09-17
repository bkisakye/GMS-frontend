import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";
import {
  Accordion,
  Card,
  Form,
  Button,
  Modal,
  ProgressBar,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Loading from './Loading'

const ApplicationPage = () => {
  const { grantName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({ answers: [] });
  const location = useLocation();
  const grantId = location.state?.grantId;
  const [showModal, setShowModal] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [files, setFiles] = useState({});
  const [choicesData, setChoicesData] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  const [existingDocuments, setExistingDocuments] = useState([]);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [focusedQuestionId, setFocusedQuestionId] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const CHARACTER_LIMITS = {
    text: 500,
    number: 10,
    date: 10,
  };

  const shouldQuestionBeVisible = (question, currentAnswers) => {
    const hasChoice = (choiceAnswers, value) => {
      return choiceAnswers.some((answer) => answer.check === value);
    };

    switch (question.id) {
      case 12:
        const question11AnswerFor12 = currentAnswers.find(
          (a) => a.question_id === 11
        );
        const choiceAnswers12 =
          question11AnswerFor12 &&
          Array.isArray(question11AnswerFor12.choice_answers)
            ? question11AnswerFor12.choice_answers
            : [];
        const isDistrictSelected = hasChoice(choiceAnswers12, "District");
        const isSubCountiesSelected = hasChoice(
          choiceAnswers12,
          "Sub-counties"
        );
        return isDistrictSelected && isSubCountiesSelected;

      case 13:
        const question11AnswerFor13 = currentAnswers.find(
          (a) => a.question_id === 11
        );
        const choiceAnswers13 =
          question11AnswerFor13 &&
          Array.isArray(question11AnswerFor13.choice_answers)
            ? question11AnswerFor13.choice_answers
            : [];
        const isDistrictOnly =
          hasChoice(choiceAnswers13, "District") &&
          !hasChoice(choiceAnswers13, "Sub-counties");
        return isDistrictOnly;

      case 22:
        const question21Answer = currentAnswers.find(
          (a) => a.question_id === 21
        );
        return question21Answer && question21Answer.answer === "No";

      default:
        return true;
    }
  };

  const updateVisibleQuestions = (currentAnswers) => {
    const newVisibleQuestions = questions.filter((question) =>
      shouldQuestionBeVisible(question, currentAnswers)
    );
    setVisibleQuestions(newVisibleQuestions);
  };

  useEffect(() => {
    updateVisibleQuestions(answers.answers);
  }, [answers.answers, questions]);

  const handleFocus = (questionId) => {
    setFocusedQuestionId(questionId);
  };

  const handleBlur = (questionId) => {
    if (!inputValues[questionId]) {
      setFocusedQuestionId(null);
    }
  };

  const handleInputChange = (e, question) => {
    handleChange(e, question);
    setInputValues((prev) => ({ ...prev, [question.id]: e.target.value }));
  };

  useEffect(() => {
    const fetchQuestionsAndResponses = async () => {
      try {
        const questionsResponse = await fetchWithAuth("/api/grants/questions/");
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        const responsesResponse = await fetchWithAuth(
          `/api/grants/responses/${grantId}/`
        );
        const responsesData = await responsesResponse.json();

        const initialAnswers = responsesData.map((response) => ({
          question_id: response.question.id,
          answer: response.answer,
          choice_answers: response.choices || [],
          question_type: response.question.question_type,
          number_of_rows: response.question.number_of_rows || 0,
        }));

        setAnswers({ answers: initialAnswers });
        setApplicationId(responsesData.application_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchQuestionsAndResponses();
  }, [grantId]);

  useEffect(() => {
    const fetchReviewStatus = async () => {
      try {
        const reviewResponse = await fetchWithAuth(
          `/api/grants/reviews/?grant=${applicationId}`
        );
        const reviewData = await reviewResponse.json();
        const status = reviewData.status || "";
        setReviewStatus(status);
        setIsReadOnly(status !== "negotiate");
      } catch (error) {
        console.error("Error fetching review status:", error);
      }
    };

    if (applicationId) {
      fetchReviewStatus();
    }
  }, [applicationId]);

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

  useEffect(() => {
    if (applicationId && userId) {
      const fetchExistingDocuments = async () => {
        try {
          const existingDocsResponse = await fetch(
            `http://127.0.0.1:8000/api/grants/applications/documents/?user_id=${userId}&application_id=${applicationId}`
          );
          const documentsData = await existingDocsResponse.json();
          setExistingDocuments(documentsData);
        } catch (error) {
          console.error("Error fetching existing documents:", error);
        }
      };

      fetchExistingDocuments();
    }
  }, [applicationId, userId]);

  const handleChange = (e, question, column = null, rowIndex = null) => {
    const { value, type, checked } = e.target;
    const questionId = question.id;
    const questionType = question.question_type;

    const maxLength = CHARACTER_LIMITS[questionType] || Infinity;
    const trimmedValue = value.slice(0, maxLength);

    // Update answers and character count
    const updateAnswers = (updater) => {
      setAnswers((prevAnswers) => {
        const newAnswers = updater(prevAnswers);
        return { ...newAnswers, answers: [...newAnswers.answers] };
        updateVisibleQuestions(newAnswers.answers);
        return newAnswers;
      });
    };

    const existingAnswerIndex = answers.answers.findIndex(
      (answer) => answer.question_id === questionId
    );

    if (existingAnswerIndex === -1) {
      if (questionType === "table") {
        const newAnswer = {
          question_id: questionId,
          answer: null,
          choice_answers: [{ [column]: trimmedValue }],
          question_type: questionType,
          number_of_rows: question.number_of_rows,
        };

        for (let i = 0; i < question.number_of_rows; i++) {
          if (i !== rowIndex) {
            newAnswer.choice_answers.push({});
          }
        }

        updateAnswers((prevAnswers) => ({
          ...prevAnswers,
          answers: [...prevAnswers.answers, newAnswer],
        }));
      } else if (questionType === "checkbox") {
        updateAnswers((prevAnswers) => ({
          ...prevAnswers,
          answers: [
            ...prevAnswers.answers,
            {
              question_id: questionId,
              answer: null,
              choice_answers: checked ? [{ check: trimmedValue }] : [],
              question_type: questionType,
            },
          ],
        }));
      } else {
        updateAnswers((prevAnswers) => ({
          ...prevAnswers,
          answers: [
            ...prevAnswers.answers,
            {
              question_id: questionId,
              answer: trimmedValue,
              choice_answers: null,
              question_type: questionType,
            },
          ],
        }));
      }
    } else {
      if (questionType === "table") {
        updateAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers.answers];
          updatedAnswers[existingAnswerIndex].choice_answers[rowIndex] = {
            ...updatedAnswers[existingAnswerIndex].choice_answers[rowIndex],
            [column]: trimmedValue,
          };
          return { ...prevAnswers, answers: updatedAnswers };
        });
      } else if (questionType === "checkbox") {
        updateAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers.answers];
          const choiceIndex = updatedAnswers[
            existingAnswerIndex
          ].choice_answers.findIndex((choice) => choice.check === trimmedValue);

          if (checked) {
            if (choiceIndex === -1) {
              updatedAnswers[existingAnswerIndex].choice_answers.push({
                check: trimmedValue,
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
          return { ...prevAnswers, answers: updatedAnswers };
        });
      } else {
        updateAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers.answers];
          updatedAnswers[existingAnswerIndex].answer = trimmedValue;
          return { ...prevAnswers, answers: updatedAnswers };
        });
      }
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [questionId]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate answers
    const missingFields = visibleQuestions.filter((question) => {
      const answer = answers.answers.find(
        (answer) => answer.question_id === question.id
      );
      if (!answer) return true;

      if (
        question.question_type === "text" ||
        question.question_type === "number" ||
        question.question_type === "date"
      ) {
        return !answer.answer;
      } else if (
        question.question_type === "checkbox" ||
        question.question_type === "radio"
      ) {
        return (
          !Array.isArray(answer.choice_answers) ||
          answer.choice_answers.length === 0
        );
      } else if (question.question_type === "table") {
        const choiceAnswersTable = Array.isArray(answer.choice_answers)
          ? answer.choice_answers
          : [];
        return choiceAnswersTable.some((row) =>
          Object.values(row).some((value) => !value)
        );
      }

      return false;
    });

    const confirmSubmit = window.confirm(
      "By confirming, you agree to the terms of the agreement. Are you ready to submit the application?"
    );

    if (confirmSubmit) {
      const method = answers.answers.length > 0 ? "PATCH" : "POST"; // Use PATCH if answers already exist

      try {
         await new Promise((resolve) => setTimeout(resolve, 2000));
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
          toast.success(
            "Your application has been saved. Please proceed to upload necessary documents in order to submit."
          );
          const responseData = await response.json();
          setApplicationId(responseData.application_id);
          setShowModal(true);
        } else {
          console.error("Error submitting application:", response);
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        toast.error(
          "An error occurred while submitting your application. Please try again later."
        );
      }
    } else {
      navigate(-1);
    }
  };

  const handleFileUpload = async () => {
    if (!applicationId) return;

    try {
      const formData = new FormData();
      Object.keys(files).forEach((key) => {
        const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];
        fileArray.forEach((file) => formData.append("documents", file));
      });

      const method = existingDocuments.length > 0 ? "PATCH" : "POST";
      const url = `http://127.0.0.1:8000/api/grants/applications/${applicationId}/documents/`;
      const token = localStorage.getItem("accessToken");
      const uploadResponse = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        toast.success("Your Application has been submitted successfully");
        navigate("/");
      } else {
        console.error("Error uploading files:", await uploadResponse.json());
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast.error("Failed to submit ypur application, please try again!");
    }
  };

  const handleFileChange = (event, choice) => {
    const { files } = event.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [choice]: Array.from(files),
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

  const EmojiFeedback = ({ type, current, limit }) => {
    const charactersLeft = limit - current;

    let emoji;
    let feedbackText;

    switch (type) {
      case "text":
        if (charactersLeft <= 0) {
          emoji = "🚫"; // Stop sign for exceeding the limit
          feedbackText = "You have exceeded the character limit!";
        } else if (charactersLeft <= 10) {
          emoji = "⚠️"; // Warning emoji
          feedbackText = `Almost there! Only ${charactersLeft} characters left.`;
        } else {
          emoji = "✅"; // Checkmark for safe
          feedbackText = `You have ${charactersLeft} characters remaining.`;
        }
        break;
      case "number":
        emoji = "🔢"; // Input numbers
        feedbackText = `You have entered ${current} out of ${limit} allowed.`;
        break;
      case "date":
        emoji = "📅"; // Calendar
        feedbackText = `Selected date: ${current}`;
        break;
      case "checkbox":
        emoji = "☑️"; // Checkbox
        feedbackText = `Checked ${current} items`;
        break;
      case "radio":
        emoji = "🔘"; // Radio button
        feedbackText = `Selected option: ${current}`;
        break;
      case "table":
        emoji = "📊"; // Table
        feedbackText = `Filled ${current} rows out of ${limit}`;
        break;
      default:
        emoji = "ℹ️"; // Information symbol
        feedbackText = "Please provide input";
    }

    return (
      <div style={{ marginTop: "5px", fontSize: "14px", color: "black" }}>
        <span role="img" aria-label="feedback">
          {emoji} {feedbackText}
        </span>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h1 className="mb-4">
        Application for Grant: {decodeURIComponent(grantName)}
      </h1>
      {isLoading && <Loading />}
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
                    {groupedQuestions[section][subSection]
                      .filter((question) => visibleQuestions.includes(question))
                      .map((question) => (
                        <Form.Group key={question.id} className="mb-3">
                          {question.question_type === "text" && (
                            <>
                              <Form.Label>
                                {question.text}
                                {focusedQuestionId === question.id && (
                                  <span className="text-muted">
                                    {" "}
                                    (Max {CHARACTER_LIMITS.text} characters)
                                  </span>
                                )}
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                value={
                                  answers.answers.find(
                                    (answer) =>
                                      answer.question_id === question.id
                                  )?.answer || ""
                                }
                                onChange={(e) => handleInputChange(e, question)}
                                onFocus={() => handleFocus(question.id)}
                                onBlur={() => handleBlur(question.id)}
                                rows={3}
                                readOnly={isReadOnly}
                                maxLength={CHARACTER_LIMITS.text}
                                isInvalid={!!validationErrors[question.id]}
                                style={{
                                  borderColor: validationErrors[question.id],
                                }}
                              />
                              {(focusedQuestionId === question.id ||
                                inputValues[question.id]) && (
                                <EmojiFeedback
                                  type="text"
                                  current={
                                    (
                                      answers.answers.find(
                                        (answer) =>
                                          answer.question_id === question.id
                                      )?.answer || ""
                                    ).length
                                  }
                                  limit={CHARACTER_LIMITS.text}
                                />
                              )}
                              <Form.Control.Feedback type="invalid">
                                {validationErrors[question.id]}
                              </Form.Control.Feedback>
                            </>
                          )}

                          {question.question_type === "number" && (
                            <>
                              <Form.Label>{question.text}</Form.Label>
                              <Form.Control
                                type="number"
                                value={
                                  answers.answers.find(
                                    (answer) =>
                                      answer.question_id === question.id
                                  )?.answer || ""
                                }
                                onChange={(e) => handleInputChange(e, question)}
                                onFocus={() => handleFocus(question.id)}
                                onBlur={() => handleBlur(question.id)}
                                readOnly={isReadOnly}
                                maxLength={CHARACTER_LIMITS.number}
                                isInvalid={!!validationErrors[question.id]}
                              />
                              {(focusedQuestionId === question.id ||
                                inputValues[question.id]) && (
                                <EmojiFeedback
                                  type="number"
                                  current={parseInt(
                                    answers.answers.find(
                                      (answer) =>
                                        answer.question_id === question.id
                                    )?.answer || "0"
                                  )}
                                  limit={CHARACTER_LIMITS.number}
                                />
                              )}
                              <Form.Control.Feedback type="invalid">
                                {validationErrors[question.id]}
                              </Form.Control.Feedback>
                            </>
                          )}

                          {question.question_type === "date" && (
                            <>
                              <Form.Label>{question.text}</Form.Label>
                              <Form.Control
                                type="date"
                                value={
                                  answers.answers.find(
                                    (answer) =>
                                      answer.question_id === question.id
                                  )?.answer || ""
                                }
                                onChange={(e) => handleInputChange(e, question)}
                                onFocus={() => handleFocus(question.id)}
                                onBlur={() => handleBlur(question.id)}
                                readOnly={isReadOnly}
                                isInvalid={!!validationErrors[question.id]}
                              />
                              {(focusedQuestionId === question.id ||
                                inputValues[question.id]) && (
                                <EmojiFeedback
                                  type="date"
                                  current={
                                    answers.answers.find(
                                      (answer) =>
                                        answer.question_id === question.id
                                    )?.answer || ""
                                  }
                                  limit={CHARACTER_LIMITS.date}
                                />
                              )}
                              <Form.Control.Feedback type="invalid">
                                {validationErrors[question.id]}
                              </Form.Control.Feedback>
                            </>
                          )}

                          {question.question_type === "checkbox" && (
                            <>
                              <Form.Label>{question.text}</Form.Label>
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
                                      onChange={(e) =>
                                        handleChange(e, question)
                                      }
                                      disabled={isReadOnly}
                                    />
                                  );
                                })}
                              </div>
                              {(focusedQuestionId === question.id ||
                                inputValues[question.id]) && (
                                <EmojiFeedback
                                  type="checkbox"
                                  current={
                                    answers.answers.find(
                                      (answer) =>
                                        answer.question_id === question.id
                                    )?.choice_answers.length || 0
                                  }
                                  limit={question.choices.length}
                                />
                              )}
                              {validationErrors[question.id] && (
                                <Alert variant="danger" className="mt-2">
                                  {validationErrors[question.id]}
                                </Alert>
                              )}
                            </>
                          )}

                          {question.question_type === "radio" && (
                            <>
                              <Form.Label>{question.text}</Form.Label>
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
                                    disabled={isReadOnly}
                                  />
                                ))}
                              </div>
                              {(focusedQuestionId === question.id ||
                                inputValues[question.id]) && (
                                <EmojiFeedback
                                  type="radio"
                                  current={
                                    answers.answers.find(
                                      (answer) =>
                                        answer.question_id === question.id
                                    )?.answer || ""
                                  }
                                  limit={question.choices.length}
                                />
                              )}
                              {validationErrors[question.id] && (
                                <Alert variant="danger" className="mt-2">
                                  {validationErrors[question.id]}
                                </Alert>
                              )}
                            </>
                          )}

                          {question.question_type === "table" && (
                            <>
                              <Form.Label>{question.text}</Form.Label>
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
                                                onFocus={() =>
                                                  handleFocus(question.id)
                                                }
                                                onBlur={() =>
                                                  handleBlur(question.id)
                                                }
                                                readOnly={isReadOnly}
                                              />
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {(focusedQuestionId === question.id ||
                                inputValues[question.id]) && (
                                <EmojiFeedback
                                  type="table"
                                  current={
                                    answers.answers.find(
                                      (answer) =>
                                        answer.question_id === question.id
                                    )?.choice_answers.length || 0
                                  }
                                  limit={question.number_of_rows}
                                />
                              )}
                              {validationErrors[question.id] && (
                                <Alert variant="danger" className="mt-2">
                                  {validationErrors[question.id]}
                                </Alert>
                              )}
                            </>
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
          disabled={isReadOnly}
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
          <Button
            variant="primary"
            onClick={handleFileUpload}
            // disabled={isReadOnly}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplicationPage;
