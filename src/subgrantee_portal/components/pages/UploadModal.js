// src/subgrantee_portal/components/UploadModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UploadModal = ({ show, onHide, onUpload, onFileChange }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Documents</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFile">
            <Form.Label>Select files to upload</Form.Label>
            <Form.Control type="file" multiple onChange={onFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onUpload}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;
