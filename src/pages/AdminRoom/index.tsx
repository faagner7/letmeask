// import { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import answerImg from '../../assets/images/answer.svg'

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

  async function handleHighlightQuestion(
    questionId: string,
    isHighlighted: boolean
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !isHighlighted,
    })
  }

  async function handleCheckQuestionAsAnswered(
    questionId: string,
    isAnswered: boolean
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !isAnswered,
    })
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
              isHighlighted={question.isHighlighted}
              isAnswered={question.isAnswered}
            >
              <button
                type="button"
                className={`${question.isAnswered && 'isAnswered'}`}
                onClick={() =>
                  handleCheckQuestionAsAnswered(
                    question.id,
                    question.isAnswered
                  )
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12.0003"
                    cy="11.9998"
                    r="9.00375"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {!question.isAnswered && (
                <button
                  type="button"
                  onClick={() =>
                    handleHighlightQuestion(question.id, question.isHighlighted)
                  }
                >
                  <img src={answerImg} alt="dar destaque para a pergunta" />
                </button>
              )}
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
