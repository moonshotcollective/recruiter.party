import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useRouter } from "next/router";
import React, { useState } from "react";
import EditBasicProfile from "../../views/editBasicProfile";
import EditPrivateProfile from "../../views/editPrivateProfile";
import EditPublicProfile from "../../views/editPublicProfile";

const EditProfile = () => {
  const router = useRouter();

  const [existingUser, setExistingUser] = useState<boolean>(false);

  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: 0,
  });
  const steps = [
    {
      label: "Private Profile",
      content: (
        <EditPrivateProfile
          nextStep={nextStep}
          prevStep={prevStep}
          activeStep={activeStep}
          reset={reset}
          existingUser={existingUser}
          setExistingUser={setExistingUser}
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
          existingUser={existingUser}
        />
      ),
    },

    {
      label: "Basic Profile",
      content: (
        <EditBasicProfile
          nextStep={nextStep}
          prevStep={prevStep}
          activeStep={activeStep}
          existingUser={existingUser}
        />
      ),
    },
  ];

  return (
    <Box margin="0 auto" maxWidth={1100} transition="0.5s ease-out">
      <Box margin="8">
        <Box as="main" marginY={22}>
          <Flex flexDir="column" width="100%">
            {existingUser && <Flex marginY={3} justifyContent='space-between'>
              <Button onClick={() => setStep(0)}>
                Edit Private Profile
              </Button>
              <Button onClick={() => setStep(1)}>
                Edit Public Profile
              </Button>
              <Button onClick={() => setStep(2)}>
                Edit Basic Profile
              </Button>
              </Flex>}
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
