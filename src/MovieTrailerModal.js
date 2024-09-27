import React from "react";
import { Modal, Box, Button } from "@mui/material";

const MovieTrailerModal = ({ open, handleClose, videoUrl }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="trailer-modal-title"
      aria-describedby="trailer-modal-description"
      sx={{
        backdrop: {
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Warna latar belakang saat modal terbuka
        },
      }}
    >
      <Box>
        <video
          width="100%"
          height="100%"
          controls
          style={{
            borderRadius: "8px", // Radius untuk video
            minHeight: "400px", // Tinggi minimum untuk video
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default MovieTrailerModal;
