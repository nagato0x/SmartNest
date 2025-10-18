import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import useAppContext from "../hooks/useAppContext";
import * as apiClient from "../api-client";

const AddBoarding = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({
        title: "Boarding Added Successfully",
        description:
          "Your boarding has been added to SmartNest successfully! Redirecting to My Boardings...",
        type: "SUCCESS",
      });
      setTimeout(() => {
        navigate("/my-boardings"); // 🔄 Redirect to your renamed section
      }, 1500);
    },
    onError: () => {
      showToast({
        title: "Failed to Add Boarding",
        description:
          "There was an error saving your boarding. Please try again.",
        type: "ERROR",
      });
    },
  });

  const handleSave = (boardingFormData: FormData) => {
    mutate(boardingFormData);
  };

  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddBoarding;
