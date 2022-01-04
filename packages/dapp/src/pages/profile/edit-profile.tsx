import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useRouter } from "next/router";
import React from "react";
import EditBasicProfile from "../../views/editBasicProfile";
import EditPrivateProfile from "../../views/editPrivateProfile";
import EditPublicProfile from "../../views/editPublicProfile";

const EditProfile = () => {
  const router = useRouter();

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const steps = [
    {
      label: "Basic Profile",
      content: (
        <EditBasicProfile
          nextStep={nextStep}
          prevStep={prevStep}
          activeStep={activeStep}
        />
      ),
    },
    {
      label: "Public Profile",
      content: (
        <EditPublicProfile
          nextStep={nextStep}
          prevStep={prevStep}
          activeStep={activeStep}
        />
      ),
    },
    {
      label: "Private Profile",
      content: (
        <EditPrivateProfile
          nextStep={nextStep}
          prevStep={prevStep}
          activeStep={activeStep}
          reset={reset}
        />
      ),
    },
  ];

  return (
    <Box margin="0 auto" maxWidth={1100} transition="0.5s ease-out">
      <Box margin="8">
        <Box as="main" marginY={22}>
          <Flex flexDir="column" width="100%">
            <Steps activeStep={activeStep}>
              {steps.map(({ label, content }) => (
                <Step p={4} label={label} key={label}>
                  {content}
                </Step>
              ))}
            </Steps>
            {activeStep === 3 && (
              <Box margin="auto">
                <Heading mt={2} mb={4} fontSize="xl">
                  All steps completed!
                </Heading>
                <Button
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Go to home page
                </Button>
              </Box>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
