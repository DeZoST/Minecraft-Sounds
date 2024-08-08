import { useState, useEffect, memo } from "react";
import {
    Box,
    Heading,
    Tag,
    TagLabel,
    Button,
    Progress,
    IconButton,
    Tooltip,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
} from "@chakra-ui/react";
import { DownloadIcon, CopyIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

const SoundCard = memo(
    ({ sound, playingSound, playingSoundData, playSound }) => {
        const toast = useToast();
        const [progress, setProgress] = useState(0);
        const isActive = playingSoundData?.file === sound.file;

        const menuBgColor = useColorModeValue("white", "gray.800");
        const menuTextColor = useColorModeValue("black", "white");

        useEffect(() => {
            if (isActive && playingSound) {
                const updateProgress = () => {
                    const newProgress =
                        (playingSound.currentTime / playingSound.duration) *
                        100;
                    setProgress(newProgress);
                };

                playingSound.addEventListener("timeupdate", updateProgress);

                return () => {
                    playingSound.removeEventListener(
                        "timeupdate",
                        updateProgress
                    );
                };
            } else {
                setProgress(0);
            }
        }, [isActive, playingSound]);

        const handleDownload = () => {
            const link = document.createElement("a");
            link.href = `http://localhost:3000/audio/${sound.file}.ogg`;
            link.download = `${sound.name}.ogg`;
            link.click();
        };

        const handleCopy = (content, description) => {
            navigator.clipboard.writeText(content);
            toast({
                title: "Copied to clipboard",
                description: description,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        };

        const getMinecraftCommand = (filePath) => {
            return `/playsound ${filePath.replace(/\//g, ".")}`;
        };

        return (
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
                <Heading as="h3" size="md">
                    {sound.name}
                </Heading>
                <Box my="4">
                    {sound.tags.split(",").map((tag, index) => (
                        <Tag key={index} mr="2" mb="2" colorScheme="teal">
                            <TagLabel>{tag}</TagLabel>
                        </Tag>
                    ))}
                </Box>
                <Box display="flex" justifyContent="center" gap={2} mt="4">
                    <Button onClick={() => playSound(sound)} colorScheme="teal">
                        {isActive && !playingSound.paused ? "Pause" : "Play"}
                    </Button>
                    <Tooltip label="Download">
                        <IconButton
                            icon={<DownloadIcon />}
                            onClick={handleDownload}
                        />
                    </Tooltip>
                    <Menu>
                        <Tooltip label="Copy">
                            <MenuButton as={IconButton} icon={<CopyIcon />} />
                        </Tooltip>
                        <MenuList bg={menuBgColor} color={menuTextColor}>
                            <MenuItem
                                onClick={() =>
                                    handleCopy(sound.file, sound.file)
                                }
                            >
                                Copy file path
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    handleCopy(sound.name, sound.name)
                                }
                            >
                                Copy name
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    handleCopy(
                                        getMinecraftCommand(sound.file),
                                        getMinecraftCommand(sound.file)
                                    )
                                }
                            >
                                Copy Minecraft command
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
                {isActive && (
                    <Box mt="4">
                        <Progress value={progress} size="sm" />
                    </Box>
                )}
            </Box>
        );
    }
);

SoundCard.displayName = "SoundCard";

SoundCard.propTypes = {
    sound: PropTypes.object.isRequired,
    playingSound: PropTypes.object,
    playingSoundData: PropTypes.object,
    playSound: PropTypes.func,
};

export default SoundCard;
