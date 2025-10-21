import React, { useState } from "react";
import Button from "../../elements/Button";
import Input from "../../elements/Input";

export default function SystemSettingsForm() {
  const [settings, setSettings] = useState({
    clinicName: "Clinical Management System",
    contactEmail: "admin@cms.com",
    openHours: "09:00-17:00",
    appointmentDuration: 30
  });

  const handleChange = e => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Send settings to API here
    alert("Settings saved!");
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 my-4">
      <h5>System Settings</h5>
      <div className="mb-3">
        <label className="form-label">Clinic Name</label>
        <Input name="clinicName" value={settings.clinicName} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Contact Email</label>
        <Input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Open Hours</label>
        <Input name="openHours" value={settings.openHours} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Default Appointment Duration (minutes)</label>
        <Input type="number" name="appointmentDuration" value={settings.appointmentDuration} onChange={handleChange} />
      </div>
      <Button type="submit">Save Settings</Button>
    </form>
  );
}
