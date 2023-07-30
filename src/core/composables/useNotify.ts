import { reactive } from "vue"

type Type = 'success' | 'error' | 'warning'

const notifyState = reactive({
  model: false,
  message: '',
  color: '',
})

export default () => {
  const getColorFromType = (type: Type) => {
    const colors = {
      success: 'green-darken-2',
      error: 'red-darken-4',
      warning: 'yellow-darken-2',
    }

    return colors[type]
  }

  const displayMessage = ({ message, type }: { message: string, type: Type }) => {
    notifyState.model = true
    notifyState.message = message
    notifyState.color = getColorFromType(type)
  }

  return {
    notifyState,
    displayMessage,
  }
}