import React, { useState } from "react";
import socket from "./WebSocketService";

const ViewResults = () => {
    const [studentNo, setStudentNo] = useState("");
    const [results, setResults] = useState([]);
    const [expandedSubjects, setExpandedSubjects] = useState([]);

    const handleGetResult = () => {
        const data = {
            command: "view_result",
            student_no: studentNo,
        };
        socket.send(data);

        socket.onMessage((event) => {
            const response = event;
            if (response.command === "view_result_response") {
                setResults(response.data);
            }
        });
    };

    const toggleExpand = (subject) => {
        if (expandedSubjects.includes(subject)) {
            setExpandedSubjects(expandedSubjects.filter((s) => s !== subject));
        } else {
            setExpandedSubjects([...expandedSubjects, subject]);
        }
    };

    return (
        <div className="view-results">
            <h2>View Results</h2>
            <div className="input-box">
                <input
                    type="text"
                    placeholder="Enter Enrollment Number"
                    value={studentNo}
                    onChange={(e) => setStudentNo(e.target.value)}
                />
                <button onClick={handleGetResult}>Get Result</button>
            </div>

            {results.length > 0 && (
                <div className="results-table">
                    <h3>Results Summary</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Marks Obtained</th>
                                <th>Total Marks</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>{result.subject}</td>
                                        <td>{result.obtained_marks}</td>
                                        <td>{result.total_marks}</td>
                                        <td>
                                            <button
                                                onClick={() => toggleExpand(result.subject)}
                                            >
                                                {expandedSubjects.includes(result.subject)
                                                    ? "Hide Details"
                                                    : "View More"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedSubjects.includes(result.subject) && (
                                        <tr className="details-row">
                                            <td colSpan="4">
                                                <table className="details-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Question No</th>
                                                            <th>Marks Allocated</th>
                                                            <th>Marks Obtained</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.answers.map((answer, i) => (
                                                            <tr key={i}>
                                                                <td>{answer.question_no}</td>
                                                                <td>{answer.allocated_mark}</td>
                                                                <td>{answer.obtained_mark}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button
                onClick={() => {
                    window.location.href = "/"; // Adjust the path as needed
                }}
            >
                Close
            </button>
        </div>
    );
};

export default ViewResults;
