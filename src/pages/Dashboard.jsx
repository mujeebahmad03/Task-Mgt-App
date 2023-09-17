import { Title } from "../component/styles/Title.styled"
import ActionNav from '../component/ActionNav'
import TaskContent from '../component/TaskContent'
import { Container, ActionWrapper } from '../component/styles/Containers.styled'


function Dashboard() {
  return (
        <Container>
          <Title>Task Manager</Title>
            <ActionWrapper>
              <ActionNav />
              <TaskContent/>
            </ActionWrapper>
        </Container>
  )
}

export default Dashboard