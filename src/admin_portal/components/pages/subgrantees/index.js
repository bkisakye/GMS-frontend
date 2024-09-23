import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { AiFillEye } from "react-icons/ai";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import useLoadingHandler from "../../../hooks/useLoadingHandler";

const Index = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { loadingStates, handleLoading } = useLoadingHandler();

  useEffect(() => {
    const fetchData = async () => {
      await handleLoading("fetchData", async () => {
        const response = await fetchWithAuth(
          `/api/subgrantees/subgrantee-profiles/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      });
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewClick = (profile) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProfile(null);
  };

  const filteredData = data.filter((profile) =>
    profile.user.organisation_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by organization name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.user.organisation_name}</td>
                <td>{profile.user.email}</td>
                <td>{profile.website}</td>
                <td>{profile.user.phone_number}</td>
                <td>{profile.organisation_address}</td>
                <td>
                  <Button
                    variant="info"
                    className="btn-sm"
                    onClick={() => handleViewClick(profile)}
                  >
                    <AiFillEye />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No profiles found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {selectedProfile && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedProfile.user.organisation_name} - Profile Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  General Organization Information
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Name: </strong>{" "}
                    {selectedProfile.user.organisation_name}
                  </p>
                  <p>
                    <strong>Acronym: </strong> {selectedProfile.acronym}
                  </p>
                  <p>
                    <strong>Address: </strong>{" "}
                    {selectedProfile.organisation_address}
                  </p>
                  <p>
                    <strong>Telephone: </strong>{" "}
                    {selectedProfile.user.phone_number}
                  </p>
                  <p>
                    <strong>Email: </strong> {selectedProfile.user.email}
                  </p>
                  <p>
                    <strong>Website: </strong> {selectedProfile.website}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Executive Director</Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedProfile.executive_director_name}
                  </p>
                  <p>
                    <strong>Contact:</strong>{" "}
                    {selectedProfile.executive_director_contact}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Board Chair</Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Name: </strong> {selectedProfile.board_chair_name}
                  </p>
                  <p>
                    <strong>Contact: </strong>{" "}
                    {selectedProfile.board_chair_contact}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>Management Capacity</Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Description: </strong>
                    {selectedProfile.organization_description}
                  </p>
                  <p>
                    <strong>Board Role: </strong>
                    {selectedProfile.role_on_board}
                  </p>
                  <p>
                    <strong>Board Meeting Frequency: </strong>
                    {selectedProfile.meeting_frequency_of_board}
                  </p>
                  <p>
                    <strong>Last 3 Board Meetings: </strong>
                    {selectedProfile.last_three_meetings_of_board}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  Financial Management and Administration
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Accounting System: </strong>
                    {selectedProfile.accounting_system}
                  </p>
                  <p>
                    <strong>
                      Do you have a Finance/ Administration Manual?{" "}
                    </strong>
                    {selectedProfile.finance_and_admin_dtl_finance_admin_manual
                      ? "Yes"
                      : "No"}
                  </p>
                  {selectedProfile.finance_and_admin_dtl_finance_admin_manual ? (
                    <>
                      <p>
                        <strong>When was it last updated? </strong>
                        {
                          selectedProfile.finance_and_admin_dtl_finance_admin_manual_updated_date
                        }
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Why not? </strong>{" "}
                      {
                        selectedProfile.finance_and_admin_dtl_finance_admin_manual_reason
                      }
                    </p>
                  )}
                  <p>
                    <strong>Do you have a Human Resource Manual? </strong>
                    {selectedProfile.finance_and_admin_dtl_hr_manual
                      ? "Yes"
                      : "No"}
                  </p>
                  {selectedProfile.finance_and_admin_dtl_hr_manual ? (
                    <>
                      <p>
                        <strong>When was it last updated? </strong>
                        {
                          selectedProfile.finance_and_admin_dtl_hr_manual_updated_date
                        }
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Why not? </strong>{" "}
                      {selectedProfile.ffinance_and_admin_dtl_hr_manual_reason}
                    </p>
                  )}
                  <p>
                    <strong>
                      Do you have an anti-corruption and/or whistleblower
                      policy?
                    </strong>
                    {selectedProfile.finance_and_admin_dtl_anti_corruption_policy
                      ? "Yes"
                      : "No"}
                  </p>
                  <p>
                    <strong>
                      Have you had one or more audits within the last three
                      years?
                    </strong>
                    {selectedProfile.finance_and_admin_dtl_audits_in_last_three_years
                      ? "Yes"
                      : "No"}
                  </p>
                  {selectedProfile.finance_and_admin_dtl_audits_in_last_three_years ? (
                    <>
                      <p>
                        <strong>
                          what kind (external, institutional, project, forensic,
                          other – please describe){" "}
                        </strong>
                        {selectedProfile.finance_and_admin_dtl_audit_details}
                      </p>
                      <p>
                        <strong>
                          did you receive a qualified opinion? Please list any
                          issues raised in the audits and what you did to
                          correct them [please add more rows if needed] {""}
                        </strong>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Date of audit</th>
                              <th>Issue raised</th>
                              <th>Action taken</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{selectedProfile.audit_date}</td>
                              <td>{selectedProfile.audit_issue_raised}</td>
                              <td>{selectedProfile.audit_action_taken}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>
                        Describe how you diagnose and respond to needs for
                        improvement within your organization.{" "}
                      </strong>{" "}
                      {selectedProfile.finance_and_admin_dtl_audit_details_not}
                    </p>
                  )}
                  <p>
                    <strong>
                      Has your organization ever been the subject of a forensic
                      audit?
                    </strong>
                    {selectedProfile.finance_and_admin_dtl_forensic_audit
                      ? "Yes"
                      : "No"}
                  </p>
                  {selectedProfile.finance_and_admin_dtl_forensic_audit && (
                    <>
                      <p>
                        <strong>
                          please provide details (dates, under which donor/
                          funding, findings. Please also include information as
                          to how you addressed the findings)
                        </strong>
                        {
                          selectedProfile.finance_and_admin_dtl_forensic_audit_details
                        }
                      </p>
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="5">
                <Accordion.Header>Technical Skills/Capacity</Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Technical Skills: </strong>
                    {selectedProfile.technical_skills}
                  </p>
                  <p>
                    <strong>Comparative Advantage: </strong>
                    {selectedProfile.technical_skills_comparative_advantage}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="6">
                <Accordion.Header>M & E Capacity</Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>M&E Systems: </strong>
                    {
                      selectedProfile.technical_skills_monitoring_and_evaluation_capacity
                    }
                  </p>
                  <p>
                    <strong>Impact Determination: </strong>
                    {selectedProfile.technical_skills_impact_determination}
                  </p>
                  <p>
                    <strong>
                      Have you conducted an external programmatic evaluation of
                      your work in the last 1 year?{" "}
                    </strong>
                    {selectedProfile.technical_skills_external_evaluation_conducted
                      ? "Yes"
                      : "No"}
                  </p>
                  {selectedProfile.technical_skills_external_evaluation_conducted ? (
                    <>
                      <p>
                        <strong>How was it conducted? </strong>
                        {
                          selectedProfile.technical_skills_external_evaluation_details
                        }
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Why not? </strong>
                      {
                        selectedProfile.technical_skills_external_evaluation_details_not
                      }
                    </p>
                  )}
                  <p>
                    <strong>
                      How do you use/ apply what you have learned from
                      evaluations (internal or external) of your work?
                    </strong>
                    {selectedProfile.technical_skills_evaluation_use}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="7">
                <Accordion.Header>Human Resource Capacity</Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>
                      In your organization, how many staff are on contract?
                    </strong>
                    Male: {selectedProfile.staff_male} Female:{" "}
                    {selectedProfile.staff_female}
                  </p>
                  <p>
                    <strong>Number of volunteers</strong>
                    Male: {selectedProfile.volunteers_male} Female:{" "}
                    {selectedProfile.volunteers_female}
                  </p>
                  <p>
                    <strong>Do you have staff dedicated to M&E?</strong>
                    {selectedProfile.staff_dedicated_to_me ? "Yes" : "No"}
                  </p>
                  {selectedProfile.staff_dedicated_to_me ? (
                    <>
                      <p>
                        <strong>what are their main responsibilities?</strong>
                        {selectedProfile.me_responsibilities}
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>
                        within the organization, how do you cover the M&E
                        functions (who does what)?
                      </strong>
                      {selectedProfile.me_coverage}
                    </p>
                  )}
                  <p>
                    <strong>
                      How are gender and/or social inclusion and rights
                      mainstreamed into in your programming?
                    </strong>
                    {selectedProfile.gender_inclusion}
                  </p>
                  <p>
                    <strong>
                      Do you have a full-time finance manager or equivalent
                      position?
                    </strong>
                    {selectedProfile.finance_manager ? "Yes" : "No"}
                  </p>
                  {!selectedProfile.finance_manager && (
                    <p>
                      <strong>
                        If not, who handles the finance? How would you manage
                        the financial operations if awarded an agreement/
                        contract by BAYLOR-UGANDA?
                      </strong>
                      {selectedProfile.finance_manager_details}
                    </p>
                  )}

                  <h5>Implementation Experience</h5>
                  <p>
                    <strong>
                      {" "}
                      List of past (completed) projects and contact information
                      [most recent 5]
                    </strong>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Donor</th>
                          <th>Timeframe of project</th>
                          <th>Budget (UGX)</th>
                          <th>Short description/outcome</th>
                          <th>Present contact info(phone and/or email)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedProfile.past_project_name}</td>
                          <td>{selectedProfile.past_project_timeframe}</td>
                          <td>{selectedProfile.past_project_budget}</td>
                          <td>{selectedProfile.past_project_outcomes}</td>
                          <td>{selectedProfile.past_project_contact_info}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </p>

                  <p>
                    <strong>
                      List of current projects and contact information [all
                      current]
                    </strong>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Donor</th>
                          <th>Timeframe of project</th>
                          <th>Budget (UGX)</th>
                          <th>Short description/outcome</th>
                          <th>Present contact info(phone and/or email)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedProfile.current_project_donor}</td>
                          <td>{selectedProfile.current_project_timeframe}</td>
                          <td>{selectedProfile.current_project_budget}</td>
                          <td>{selectedProfile.current_project_description}</td>
                          <td>
                            {selectedProfile.current_project_contact_info}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </p>

                  <p>
                    <strong>
                      describe how your current work includes or emphasizes
                      gender, women, or youth{" "}
                    </strong>
                    {selectedProfile.current_work_emphasizes}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="8">
                <Accordion.Header>
                  Organizations/Institutions which your organization has
                  worked/partnered with in the past
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>
                      Please list any organization or entity (government,
                      national or international) with which your organization
                      has had (or currently has) a working relationship that
                      does not involve a contract or funding
                    </strong>
                    Organizations from which you have received funding are
                    included above and those you have funded are listed below
                    [please add lines if needed]
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Name of the organization/entity</th>
                          <th>Briefly describe the relationship/engagement</th>
                          <th>When [period]</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedProfile.partnership_name}</td>
                          <td>{selectedProfile.partnership_description}</td>
                          <td>{selectedProfile.partnership_period}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </p>

                  <p>
                    <strong>
                      Have you ever sub-granted or sub-contracted to another
                      organization in the past 3 years? Please list details
                    </strong>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Name of organization</th>
                          <th>Period</th>
                          <th>Purpose</th>
                          <th>Amount (UGX)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedProfile.subgrant_donor}</td>
                          <td>{selectedProfile.subgrant_duration}</td>
                          <td>{selectedProfile.subgrant_description}</td>
                          <td>{selectedProfile.subgrant_amount}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Index;
