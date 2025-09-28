import React from 'react';
import { Modal } from './ui/Modal.jsx';
import { Button } from './ui/Button.jsx';

export const WelcomeBackModal = ({ onResume, onStartNew }) => {
  return (
    <Modal isOpen={true} title="Welcome Back!">
      <p className="text-gray-800  mb-6">
        You have an interview in progress. Would you like to resume or start a new one?
      </p>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onStartNew}>
          Start New
        </Button>
        <Button variant="primary" onClick={onResume}>
          Resume Interview
        </Button>
      </div>
    </Modal>
  );
};