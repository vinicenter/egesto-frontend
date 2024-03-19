import { defineStore } from "pinia";
import { FormContext, useForm } from "vee-validate";
import { Ref } from "vue";
import { IBillFilters } from "../types/bill";
import dayjs from "~utils/dayjs";

interface BillsFormFilter {
  dateFilterType: 'month' | 'day' | 'period';
  endDueDate?: string,
  startDueDate?: string,
  dueDate?: string,
  dueMonth?: number,
  dueYear?: number,
  recipient?: string,
  isPaid: boolean | string
  type?: "BOLETO" | "CHEQUE" | "PIX" | "TRANSFERENCIA_BANCARIA" | "DINHEIRO" | undefined
}

interface States {
  form?: Ref<FormContext<BillsFormFilter, BillsFormFilter>>
  formId?: string
  queryVariables: Partial<IBillFilters>
  filter: BillsFormFilter
}

const buildInitialValues = (initialValues: Partial<IBillFilters>): BillsFormFilter => {
  return {
    dateFilterType: 'period',
    dueYear: dayjs().year(),
    dueMonth: dayjs().month(),
    ...initialValues
  } as BillsFormFilter
}

const makeInitialQueryVariables = (): Partial<IBillFilters> => ({
  isPaid: 'undefined',
  startDueDate: dayjs().toISOString(),
})

export const useBillsFilterStore = defineStore('bills-filter-store', {
  state: (): States => ({
    filter: {
      dateFilterType: 'month',
      isPaid: 'undefined',
      dueDate: undefined,
      dueMonth: undefined,
      dueYear: undefined,
      endDueDate: undefined,
      recipient: undefined,
      startDueDate: undefined,
      type: undefined
    },
    form: undefined,
    formId: undefined,
    queryVariables: makeInitialQueryVariables(),
  }),
  actions: {
    createForm() {
      const form = useForm<BillsFormFilter>({
        initialValues: buildInitialValues(this.queryVariables),
        keepValuesOnUnmount: true
      })

      this.form = form

      return this.form
    },
    submit() {
      return this.form?.handleSubmit((values) => {
        const getEndDueDate = () => {
          if(values.dateFilterType === 'month' && values.dueMonth !== undefined && values.dueYear !== undefined) {
            return dayjs().set('month', values.dueMonth).set('year', values.dueYear).endOf('month').toString()
          }

          return values.dateFilterType === 'day'
            ? values.dueDate
            : values.endDueDate
        }

        const getStartDueDate = () => {
          if(values.dateFilterType === 'month' && values.dueMonth !== undefined && values.dueYear !== undefined) {
            return dayjs().set('month', values.dueMonth).set('year', values.dueYear).startOf('month').toString()
          }

          return values.dateFilterType === 'day'
            ? values.dueDate
            : values.startDueDate
        }

        this.queryVariables = {
          endDueDate: getEndDueDate(),
          startDueDate: getStartDueDate(),
          isPaid: values.isPaid,
          recipient: values.recipient,
          type: values.type,
        }
      })
    },
    resetQueryVariables() {
      this.queryVariables = makeInitialQueryVariables()
    }
  },
})
