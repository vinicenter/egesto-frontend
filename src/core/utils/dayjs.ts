import dayjs from 'dayjs'

import ptBR from 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import objectSupport from 'dayjs/plugin/objectSupport'
import duration from 'dayjs/plugin/duration'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.locale(ptBR)

dayjs.extend(objectSupport)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(isSameOrAfter)

export default dayjs
