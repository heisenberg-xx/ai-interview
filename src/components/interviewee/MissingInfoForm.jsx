import React, { useState } from "react";
import { useInterviewStore } from "../../store/useStore.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Card, CardContent } from "../ui/Card.jsx";

const MissingInfoForm = ({ candidate }) => {
  const { updateCandidate } = useInterviewStore();
  const [formData, setFormData] = useState({
    name: candidate.name || "",
    email: candidate.email || "",
    phone: candidate.phone || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCandidate(candidate.id, {
      ...formData,
      interview: {
        ...candidate.interview,
        status: "IN_PROGRESS",
      },
    });
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <h2 className="text-xl font-semibold mb-2 text-white">
          One last step...
        </h2>
        <p className="text-gray-600 mb-6">
          Please provide the missing information to begin your interview.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!candidate.name && (
            <Input
              id="name"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          {!candidate.email && (
            <Input
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}
          {!candidate.phone && (
            <Input
              id="phone"
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          )}
          <Button type="submit" className="w-full">
            Begin Interview
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MissingInfoForm;
