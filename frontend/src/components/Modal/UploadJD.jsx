import React, { useState } from "react";

const UploadJD = ({ resume, onClose, onAnalyze }) => {
  const [jobDescription, setJobDescription] = useState('');

  const handleAnalyze = () => {
    onAnalyze(jobDescription);
  };

  return (
    <div clas></div>
  )
}