import { FC, useState, useRef } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ConfirmationDialog } from "../../../shared/dialog";
import { JsonSchemaForm } from "../../../shared/components";
import { usePatientSurveySchemaQuery } from "../hooks/usePatientSurveySchemaQuery";
import { usePatientSchemaQuery } from "../hooks/usePatientSchemaQuery";
import { usePatientApi } from "../hooks/usePatientApi";
import { usePatientEvent } from "../hooks/usePatientEvent";

const useStyles = makeStyles(() =>
  createStyles({
    backdrop: {
      zIndex: 100,
      color: "#fff",
    },
    img: {
      display: "flex",
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: "100%",
    },
    paper: {
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 600,
      padding: 50,
    },
  })
);

export const PatientForm: FC = () => {
  const { patientEvent } = usePatientEvent();

  const {
    isLoading: patientSurveySchemaIsLoading,
    patientSurveySchema,
  } = usePatientSurveySchemaQuery();

  const {
    isLoading: patientSchemaIsLoading,
    patientSchema,
  } = usePatientSchemaQuery();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const classes = useStyles();
  const handleClose = () => {
    setShowConfirmation(false);
  };

  const patientFormRef = useRef({});
  const surveyFormRef = useRef({});
  const { createPatient, createNameNote } = usePatientApi();

  const handleSubmit = () => {
    setIsSubmitting(true);
    createPatient(patientFormRef?.current)
      .then(({ data }) =>
        createNameNote(data.ID, patientEvent?.id || "", surveyFormRef?.current)
      )
      .then(() => {
        setIsSubmitting(false);
        setShowConfirmation(true);
      });
  };

  const handlePatientChange = ({ formData }: { formData: any }) => {
    if (patientFormRef?.current) {
      patientFormRef.current = formData;
    }
  };
  const handleSurveyChange = ({ formData }: { formData: any }) => {
    if (surveyFormRef?.current) {
      surveyFormRef.current = formData;
    }
  };
  return (
    <Paper className={classes.paper}>
      <img className={classes.img} src="logo.png" />

      {!patientSchemaIsLoading ? (
        <JsonSchemaForm
          id="patient"
          schema={patientSchema?.jsonSchema ?? {}}
          uiSchema={patientSchema?.uiSchema ?? {}}
          onChange={handlePatientChange}
        >
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </JsonSchemaForm>
      ) : (
        <Box
          height="50vh"
          justifyContent="center"
          alignItems="center"
          flex={1}
          display="flex"
        >
          <CircularProgress />
        </Box>
      )}

      {!patientSurveySchemaIsLoading ? (
        <JsonSchemaForm
          id="patientSurvey"
          schema={patientSurveySchema?.jsonSchema ?? {}}
          uiSchema={patientSurveySchema?.uiSchema ?? {}}
          onChange={handleSurveyChange}
        >
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </JsonSchemaForm>
      ) : (
        <Box
          height="50vh"
          justifyContent="center"
          alignItems="center"
          flex={1}
          display="flex"
        >
          <CircularProgress />
        </Box>
      )}

      <Backdrop className={classes.backdrop} open={isSubmitting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ConfirmationDialog
        open={showConfirmation}
        title="Success!"
        handleClose={handleClose}
      >
        Patient created successfully
      </ConfirmationDialog>
    </Paper>
  );
};
