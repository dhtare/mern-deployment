import React, { useState } from "react";
import "../styles/Global.css";
import { submitFeedback } from "../services/api";
import Select from "react-select";
import { useLocation } from "react-router-dom";

const serviceOptions = [
  { value: "bvn", label: "BVN" },
  { value: "nin", label: "NIN" },
  { value: "visa", label: "Visa" },
  { value: "passport", label: "Passport" },
];

const centerOptions = [
  { value: "abuja", label: "Abuja, Nigeria" },
  { value: "ankara", label: "Ankara, Turkey" },
  { value: "atlanta", label: "Atlanta, USA" },
  { value: "beijing", label: "Beijing, China" },
  { value: "beirut", label: "Beirut, Lebanon" },
  { value: "dubai", label: "Dubai, UAE" },
  { value: "guangzhou", label: "Guangzhou, China" },
  { value: "houston", label: "Houston, TX, USA" },
  { value: "johannesburg", label: "Johannesburg, SA" },
  { value: "kualaLumpur", label: "Kuala Lumpur, Malaysia" },
  { value: "losangeles", label: "Los Angeles, USA" },
  { value: "maitama", label: "Maitama Nigeria" },
  { value: "newdelhi", label: "New Delhi, India" },
  { value: "paris", label: "Paris, France" },
  { value: "rome", label: "Rome, Italy" },
  { value: "shanghai", label: "Shanghai, China" },
  { value: "thehague", label: "The Hague, Netherlands" },
  { value: "washingtondc", label: "Washington DC, USA" },
];

const FeedbackForm = () => {
  const [satisfaction, setSatisfaction] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [service, setService] = useState(null);
  const [center, setCenter] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [question1Answered, setQuestion1Answered] = useState(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  // Fetching parameters from url
  const fetchCenter = queryParams.get("center");
  const fetchService = queryParams.get("service");
  const uniqueId = queryParams.get("unique_id");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!satisfaction || !recommendation ) {
      setError("All fields are mandatory. Please fill them out.");
      return;
    }

    const feedback = {
      fq1: satisfaction,
      fq2: recommendation,
      fq3: reason ? reason: "",
      service: service ? service : fetchService,
      center: center ? center : fetchCenter,
      unique_id: uniqueId ? uniqueId : "",
    };

    console.log(feedback, 'feedback')
    try {
      const response = await submitFeedback(feedback);
      setSuccessMessage("✅ Thank you so much for your Feedback!");
      setSubmitted(true);

      setTimeout(() => {
        window.location.reload();
      }, 3000);

      // Clear the form after submission
      setSatisfaction("");
      setRecommendation("");
      setReason("");
      setService(null);
      setCenter(null);
      setError(null);
      setQuestion1Answered(false);
    } catch (error) {
      setError("Failed to submit feedback. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="feedback-form" style={{ padding: "20px", margin: "auto" }}>
      <h2>Customer Feedback Form</h2>
      {submitted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          <p style={{ color: "green", fontSize: "24px" }}>{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {!fetchCenter && !fetchService && !uniqueId ? (
            <>
              <div className="form-section">
                <label>Select the service:</label>
                <Select
                  value={service}
                  onChange={setService}
                  options={serviceOptions}
                  isSearchable
                  placeholder="Select a service"
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "10px",
                    }),
                  }}
                  required
                />
              </div>

              <div className="form-section">
                <label>Select Center:</label>
                <Select
                  value={center}
                  onChange={setCenter}
                  options={centerOptions}
                  isSearchable
                  placeholder="Select Center"
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "10px",
                    }),
                  }}
                  required
                />
              </div>
            </>
          ) : (
            <p></p>
          )}
          <div className="form-section">
            <label>Overall, how satisfied are you with our service?</label>
            <span
              style={{ fontSize: "14px", display: "block", marginTop: "5px" }}
            >
              where 5 means Very Satisfied, 4 means Satisfied, 3 means Neutral,
              2 means Unsatisfied, 1 means Very Unsatisfied
            </span>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  onClick={() => {
                    setSatisfaction(num.toString());
                    setQuestion1Answered(true);
                  }}
                  style={{
                    cursor: "pointer",
                    fontSize: "30px",
                    opacity: satisfaction === num.toString() ? 1 : 0.6,
                    margin: "5px",
                    textAlign: "center",
                  }}
                >
                  {num === 1
                    ? "😢"
                    : num === 2
                    ? "😟"
                    : num === 3
                    ? "😐"
                    : num === 4
                    ? "😊"
                    : "😁"}
                  <p style={{ margin: "0", fontSize: "14px" }}>
                    {num === 1
                      ? "Very Unsatisfied"
                      : num === 2
                      ? "Unsatisfied"
                      : num === 3
                      ? "Neutral"
                      : num === 4
                      ? "Satisfied"
                      : "Very Satisfied"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="form-section"
            style={{
              marginTop: question1Answered ? "20px" : "0",
              visibility: question1Answered ? "visible" : "hidden",
              height: question1Answered ? "auto" : "0",
              overflow: "hidden",
              transition: "height 0.2s ease",
            }}
          >
            <label>
              On a scale of 0 to 10, how likely are you to recommend our service
              to a friend or colleague who is looking for similar services?
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px 0",
                flexWrap: "wrap",
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <label
                  key={num}
                  style={{ flex: "1", textAlign: "center", margin: "5px" }}
                >
                  <div
                    onClick={() => setRecommendation(num.toString())}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "5px",
                      backgroundColor:
                        recommendation === num.toString() ? "#28a745" : "#ddd",
                      color:
                        recommendation === num.toString() ? "white" : "black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                  >
                    {num}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {recommendation && (
            <div className="form-section">
              <label>
                What is the primary reason for your score of {recommendation}?
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3"
                style={{ width: "100%" }}
              />
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button type="submit" className="submit-button">
              SUBMIT FEEDBACK
            </button>
          </div>
        </form>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FeedbackForm;
