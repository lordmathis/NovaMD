import React, { useState } from 'react';
import {
  Box,
  Popover,
  Stack,
  Paper,
  ScrollArea,
  Group,
  UnstyledButton,
  Text,
  Loader,
  Center,
  ActionIcon,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { IconFolders, IconSettings, IconFolderPlus } from '@tabler/icons-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useModalContext } from '../../contexts/ModalContext';
import { listWorkspaces } from '../../services/api';
import CreateWorkspaceModal from '../modals/workspace/CreateWorkspaceModal';

const WorkspaceSwitcher = () => {
  const { currentWorkspace, switchWorkspace } = useWorkspace();
  const { setSettingsModalVisible, setCreateWorkspaceModalVisible } =
    useModalContext();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const theme = useMantineTheme();

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const list = await listWorkspaces();
      setWorkspaces(list);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
    setLoading(false);
  };

  const handleCreateWorkspace = () => {
    setPopoverOpened(false);
    setCreateWorkspaceModalVisible(true);
  };

  const handleWorkspaceCreated = async (newWorkspace) => {
    await loadWorkspaces();
    switchWorkspace(newWorkspace.name);
  };

  return (
    <>
      <Popover
        width={300}
        position="bottom-start"
        shadow="md"
        opened={popoverOpened}
        onChange={setPopoverOpened}
      >
        <Popover.Target>
          <UnstyledButton
            onClick={() => {
              setPopoverOpened((o) => !o);
              if (!popoverOpened) {
                loadWorkspaces();
              }
            }}
          >
            <Group gap="xs">
              <IconFolders size={20} />
              <div>
                <Text size="sm" fw={500}>
                  {currentWorkspace?.name || 'No workspace'}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        </Popover.Target>

        <Popover.Dropdown p="xs">
          <Group justify="space-between" mb="md" px="xs">
            <Text size="sm" fw={600}>
              Workspaces
            </Text>
            <Tooltip label="Create New Workspace">
              <ActionIcon
                variant="default"
                size="md"
                onClick={handleCreateWorkspace}
              >
                <IconFolderPlus size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <ScrollArea.Autosize mah={400} offsetScrollbars>
            <Stack gap="xs">
              {loading ? (
                <Center p="md">
                  <Loader size="sm" />
                </Center>
              ) : (
                workspaces.map((workspace) => {
                  const isSelected = workspace.name === currentWorkspace?.name;
                  return (
                    <Paper
                      key={workspace.name}
                      p="xs"
                      withBorder
                      style={{
                        backgroundColor: isSelected
                          ? theme.colors.blue[
                              theme.colorScheme === 'dark' ? 8 : 1
                            ]
                          : undefined,
                        borderColor: isSelected
                          ? theme.colors.blue[
                              theme.colorScheme === 'dark' ? 7 : 5
                            ]
                          : undefined,
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <UnstyledButton
                          style={{ flex: 1 }}
                          onClick={() => {
                            switchWorkspace(workspace.name);
                            setPopoverOpened(false);
                          }}
                        >
                          <Box>
                            <Text
                              size="sm"
                              fw={500}
                              truncate
                              c={
                                isSelected
                                  ? theme.colors.blue[
                                      theme.colorScheme === 'dark' ? 0 : 9
                                    ]
                                  : undefined
                              }
                            >
                              {workspace.name}
                            </Text>
                            <Text
                              size="xs"
                              c={
                                isSelected
                                  ? theme.colorScheme === 'dark'
                                    ? theme.colors.blue[2]
                                    : theme.colors.blue[7]
                                  : 'dimmed'
                              }
                            >
                              {new Date(
                                workspace.createdAt
                              ).toLocaleDateString()}
                            </Text>
                          </Box>
                        </UnstyledButton>
                        {isSelected && (
                          <Tooltip label="Workspace Settings">
                            <ActionIcon
                              variant="subtle"
                              size="lg"
                              color={
                                theme.colorScheme === 'dark'
                                  ? 'blue.2'
                                  : 'blue.7'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettingsModalVisible(true);
                                setPopoverOpened(false);
                              }}
                            >
                              <IconSettings size={18} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    </Paper>
                  );
                })
              )}
            </Stack>
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
      <CreateWorkspaceModal onWorkspaceCreated={handleWorkspaceCreated} />
    </>
  );
};

export default WorkspaceSwitcher;
