// import { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
// import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { Question } from '../../components/Question'

import '../Room/styles.scss'
import { database } from '../../services/firebase'

interface RoomParamsProps {
  id: string
}

export function AdminRoom() {
  // const { user } = useAuth()
  const params = useParams<RoomParamsProps>()
  const roomId = params.id
  const history = useHistory()

  const { questions, title } = useRoom(roomId)

  // const [newQuestion, setNewQuestion] = useState('')

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleRemoveQuestion(questionId: string) {
    if (window.confirm('Você tem certeza que deseja remover esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>{title ?? 'Sala'}</h1>
          {!!questions && (
            <span>
              {questions.length}{' '}
              {questions.length === 1 ? 'pergunta' : 'perguntas'}
            </span>
          )}
        </div>

        <div className="question-list">
          {questions?.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleRemoveQuestion(question.id)}
              >
                <img src={deleteImg} alt="remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
