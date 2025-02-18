// help.js
import React from "react";
export default function Help() {
    return (
        <div className="help-container">
            <div>            
                <h2>Contact Details</h2>
                <p>If you have any questions or need further information, please feel free to contact us:</p>
                <p>Email: contact@yourwebsite.com</p>
                <p>Phone: +1 234 567 890</p>
                <p>Address: 123 Your Street, Your City, Your Country</p>
                
                <form id="reportForm">
                    <div className="form-group">
                        <label htmlFor="reportIssue">Describe the issue:</label>
                        <textarea id="reportIssue" className="form-control" rows="5" placeholder="Describe the issue you are facing" required></textarea>
                    </div>
                    <input type="submit" value="Report" className="btn btn-danger" />
                </form>
            </div>

            <div>
                <h2>Feedback</h2>
                <form id="feedbackForm">
                    <div className="form-group">
                        <label htmlFor="feedbackMessage">Your Feedback:</label>
                        <textarea id="feedbackMessage" className="form-control" rows="5" placeholder="We would love to hear your thoughts or feedback on how we can improve!" required></textarea>
                    </div>
                    <input type="submit" value="Submit Feedback" className="btn btn-success" />
                </form>
            </div>
        </div>
    );
}
