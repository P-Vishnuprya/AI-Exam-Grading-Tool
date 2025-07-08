import React, { useState, useEffect } from "react";
import socket from "./WebSocketService"; // Import WebSocket utility
import ViewResults from "./Results";

const Dashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [showViewResults, setShowViewResults] = useState(false);
    const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
    const [showSubmitAnswerSheetForm, setShowSubmitAnswerSheetForm] = useState(false);
    const [subjectName, setSubjectName] = useState("");
    const [questions, setQuestions] = useState([
        { question_no: "", keywords: "", answer: "", marks: "" },
    ]);

    const [answerSheets, setAnswerSheets] = useState([{ student_no: "", file: null }]); // Initialize with one sheet
    const [selectedSubject, setSelectedSubject] = useState("");
    //const [studentNo, setStudentNo] = useState("");
    const [subjectAddedMessage, setSubjectAddedMessage] = useState("");

    // Fetch subjects from the socket when component mounts
    useEffect(() => {
        socket.send({ command: "request_subjects" });

        socket.onMessage((event) => {
            const response = event;
            if (response.command === "request_subjects_response") {
                setSubjects(response.data);
            }
            if (response.command === "add_subject_response") {
                if (response.status === true) { // Correct comparison
                    setSubjectAddedMessage("Subject added successfully!");
                } else {
                    setSubjectAddedMessage("Failed to add subject.");
                }
            }
        });
    }, []);

    // Add a new question to the questions array
    const addQuestion = () => {
        setQuestions([
            ...questions,
            { question_no: "", keywords: "", answer: "" },
        ]);
    };
    if (showViewResults) {
        return <ViewResults onBack={() => setShowViewResults(false)} />;
      }

    // Handle the form submission for Add Subject
    const handleAddSubject = (e) => {
        e.preventDefault();
        const data = {
            command: "add_subject",
            data: {
                subject: subjectName,
                questions: questions.map((q) => ({
                    question_no: q.question_no,
                    keywords: q.keywords,
                    answer: q.answer,
                    marks: q.marks,
                })),
            },
        };

        // Send the data to the socket
        socket.send(data);

        // Reset form and message after submission
        setSubjectName("");
        setQuestions([{ question_no: "", keywords: "", answer: "", marks: "" }]);
        setSubjectAddedMessage("");
    };


    // Handle form submission for submitting answer sheets
    const handleSubmitAnswerSheets = (e) => {
        e.preventDefault();

        answerSheets.forEach((sheet) => {
            const reader = new FileReader();

            reader.onload = () => {
                const fileData = reader.result;

                const data = {
                    command: "add_answersheet",
                    subject: selectedSubject,
                    student_no: sheet.student_no,
                    file: fileData,
                };

                socket.send(data);
            };

            if (sheet.file) {
                reader.readAsDataURL(sheet.file);
            }
        });

        // Reset form and show success message
        setAnswerSheets([{ student_no: "", file: null }]);
        setSelectedSubject("");
        setShowSubmitAnswerSheetForm(false);
        setSubjectAddedMessage("Answer sheets submitted successfully!");
    };



    // Add a new answer sheet to the array
    const addAnswerSheet = () => {
        setAnswerSheets([
            ...answerSheets,
            { student_no: "", file: null },
        ]);
    };

    // Auto-resize the textarea
    const handleTextareaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div>
            <h2>Dashboard</h2>

            <button onClick={() => setShowAddSubjectForm(!showAddSubjectForm)}>
                {showAddSubjectForm ? "Cancel Add Subject" : "Add Subject"}
            </button>

            {showAddSubjectForm && (
                <form onSubmit={handleAddSubject}>
                    <h3>Add Subject</h3>
                    <input
                        type="text"
                        placeholder="Subject Name"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        required
                    />

                    {questions.map((q, index) => (
                        <div key={index}>
                            <h4>Question {index + 1}</h4>
                            <input
                                type="number"
                                placeholder="Question No"
                                value={q.question_no}
                                onChange={(e) =>
                                    setQuestions(
                                        questions.map((question, i) =>
                                            i === index ? { ...question, question_no: e.target.value } : question
                                        )
                                    )
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Keywords"
                                value={q.keywords}
                                onChange={(e) =>
                                    setQuestions(
                                        questions.map((question, i) =>
                                            i === index ? { ...question, keywords: e.target.value } : question
                                        )
                                    )
                                }
                                required
                            />
                            <textarea
                                placeholder="Answer"
                                value={q.answer}
                                onChange={(e) =>
                                    setQuestions(
                                        questions.map((question, i) =>
                                            i === index ? { ...question, answer: e.target.value } : question
                                        )
                                    )
                                }
                                onInput={handleTextareaResize}
                                required
                                style={{ width: '100%', minHeight: '50px', resize: 'none' }}
                            />
                            <input
                                type="number"
                                placeholder="Marks"
                                value={q.marks}
                                onChange={(e) =>
                                    setQuestions(
                                        questions.map((question, i) =>
                                            i === index ? { ...question, marks: e.target.value } : question
                                        )
                                    )
                                }
                                required
                            />
                        </div>
                    ))}

                    <button type="button" onClick={addQuestion}>
                        Add New Question
                    </button>
                    <button type="submit">Submit Subject</button>
                </form>
            )}

            {subjectAddedMessage && <p>{subjectAddedMessage}</p>}

            <button onClick={() => setShowSubmitAnswerSheetForm(!showSubmitAnswerSheetForm)}>
                {showSubmitAnswerSheetForm ? "Cancel Submit Answer Sheets" : "Submit Answer Sheets"}
            </button>

            {showSubmitAnswerSheetForm && (
                <form onSubmit={handleSubmitAnswerSheets}>
                    <h3>Submit Answer Sheets</h3>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        required
                    >
                        <option value="">Select Subject</option>
                        {subjects.length > 0 ? (
                            subjects.map((subject, index) => (
                                <option key={index} value={subject}>
                                    {subject}
                                </option>
                            ))
                        ) : (
                            <option value="">No subjects available</option>
                        )}
                    </select>

                    {answerSheets.map((sheet, index) => (
                        <div key={index}>
                            <h4>Answer Sheet {index + 1}</h4>
                            <input
                                type="number"
                                placeholder="Student Number"
                                value={sheet.student_no}
                                onChange={(e) => {
                                    const newSheets = [...answerSheets];
                                    newSheets[index].student_no = e.target.value;
                                    setAnswerSheets(newSheets);
                                }}
                                required
                            />
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const newSheets = [...answerSheets];
                                    newSheets[index].file = e.target.files[0];
                                    setAnswerSheets(newSheets);
                                }}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addAnswerSheet}>
                        Add New Answer Sheet
                    </button>
                    <button type="submit">Submit Answer Sheets</button>
                </form>
            )}

            <button
                className="view-results-btn"
                onClick={() => setShowViewResults(true)} // Correctly use setShowViewResults
            >
                View Results
            </button>

            <button
                onClick={() => {
                    localStorage.removeItem("email");
                    localStorage.removeItem("token");
                    // Optionally, you can redirect the user to a login page or home page
                    window.location.href = "/"; // Adjust the path as needed
                }}
            >
                Logout
            </button>

        </div>
    );
};

export default Dashboard;
