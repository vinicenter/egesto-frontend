import { reactive } from "vue"

type Type = 'success' | 'error' 

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