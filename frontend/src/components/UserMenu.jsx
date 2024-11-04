import React, { useState } from 'react';
import {
  Avatar,
  Popover,
  Stack,
  UnstyledButton,
  Group,
  Text,
  Divider,
} from '@mantine/core';
import { IconUser, IconLogout, IconUserCircle } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu = () => {
  const [opened, setOpened] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Popover
      width={200}
      position="bottom-end"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Avatar
          radius="xl"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpened((o) => !o)}
        >
          <IconUser size={24} />
        </Avatar>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="sm">
          {/* User Info Section */}
          <Group gap="sm">
            <Avatar radius="xl" size="md">
              <IconUser size={24} />
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                John Doe
              </Text>
              <Text size="xs" c="dimmed">
                john.doe@example.com
              </Text>
            </div>
          </Group>

          <Divider />

          {/* Menu Items */}
          <UnstyledButton
            onClick={() => console.log('Account settings')}
            px="sm"
            py="xs"
            style={(theme) => ({
              borderRadius: theme.radius.sm,
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Group>
              <IconUserCircle size={16} />
              <Text size="sm">Account Settings</Text>
            </Group>
          </UnstyledButton>

          <UnstyledButton
            onClick={handleLogout}
            px="sm"
            py="xs"
            color="red"
            style={(theme) => ({
              borderRadius: theme.radius.sm,
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Group>
              <IconLogout size={16} color="red" />
              <Text size="sm" c="red">
                Logout
              </Text>
            </Group>
          </UnstyledButton>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default UserMenu;
