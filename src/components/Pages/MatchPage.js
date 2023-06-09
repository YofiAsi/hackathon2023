import { Avatar, Button, Card, Container, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import React from 'react'

export default function MatchPage() {
  return (
    <Container sx={{justifyItems: 'center', textAlign: 'center'}}>
        <Stack spacing={3}>
            <Typography variant='h2'>
                It's a match !
            </Typography>
            <Card>
                <Stack>
                    <List>
                        <ListItem>
                        <ListItemAvatar>
                                <Avatar src='https://media.licdn.com/dms/image/D5603AQGgdEZYYAzDRw/profile-displayphoto-shrink_800_800/0/1680180534950?e=1691625600&v=beta&t=VmxOk2aCZ7yqlt0x7HZmgI3OidT4QVqIIo89b6nqB8A'/>
                        </ListItemAvatar>
                        <ListItemText>
                          Avi
                        </ListItemText>
                        </ListItem>

                        <ListItem>
                        <ListItemAvatar>
                                <Avatar src='https://media.licdn.com/dms/image/D4D03AQEcBgzpzZOx4w/profile-displayphoto-shrink_800_800/0/1676840480393?e=1691625600&v=beta&t=aN7muSdv-b6j_wcDFki25vwvEwc6OnEdxyGVW5v0iXk'/>
                        </ListItemAvatar>
                        <ListItemText>
                          Snir
                        </ListItemText>
                        </ListItem>

                        <ListItem>
                        <ListItemAvatar>
                                <Avatar src='https://media.licdn.com/dms/image/C4D03AQFGIxyg1qDe2w/profile-displayphoto-shrink_800_800/0/1652552694421?e=1691625600&v=beta&t=C8GPkx5DiBCCZEsqwZKQTuqdb5uLO-f0xGLkDBBAT0Y'/>
                        </ListItemAvatar>
                        <ListItemText>
                          Itamar
                        </ListItemText>
                        </ListItem>

                        <ListItem>
                        <ListItemAvatar>
                                <Avatar src='https://media.licdn.com/dms/image/C4E03AQEdLNj7H2OXIA/profile-displayphoto-shrink_800_800/0/1636479279976?e=1691625600&v=beta&t=MSsk9DSXkWq84NIitFQurZ9OP3s64-gQ4WUUJ904_qU'/>
                        </ListItemAvatar>
                        <ListItemText>
                          Dor
                        </ListItemText>
                        </ListItem>

                        <ListItem>
                        <ListItemAvatar>
                                <Avatar src='https://media.licdn.com/dms/image/C4D03AQEB9HVxjBi1ow/profile-displayphoto-shrink_800_800/0/1626795253790?e=1691625600&v=beta&t=mUWEYHQuf4rv0aiDu6TFcrTiU8z4evHenbBnPnEXOMQ'/>
                        </ListItemAvatar>
                        <ListItemText>
                          Asaf
                        </ListItemText>
                        </ListItem>
                    </List>
                </Stack>
            </Card>
            <Typography>
              Agree to share your phone number
            </Typography>
            <Button size='large' variant="outlined">
              Agree
            </Button>
        </Stack>
    </Container>
  )
}
