import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import SoundCard from "./SoundCard";

function SoundList({ sounds }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="40px" mx={"auto"}>
      {sounds.map((sound, index) => (
        <SoundCard key={index} sound={sound} />
      ))}
    </SimpleGrid>
  );
}

SoundList.propTypes = {
  sounds: PropTypes.array.isRequired,
};

export default SoundList;
