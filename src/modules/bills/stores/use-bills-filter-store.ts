import { defineStore } from "pinia";
import { FormContext, useForm } from "vee-validate";
import { Ref } from "vue";
import { BillPaymentMethods, IBillPaginationFilters } from "../types/bill";
import dayjs from "~utils/dayjs";

export interface BillsFormFilter {
  dateFilterType: 'month' | 'day' | 'period' | 'no-period';
  tagsFilterType: 'AND' | 'OR';
  endDueDate?: string,
  startDueDate?: string,
  dueDate?: string,
  dueMonth?: number,
  tags: string[],
  dueYear?: number,
  recipient?: string,
  installment?: string,
  isPaid: boolean | string
  paymentMethod?: BillPaymentMethods[]
}

interface States {
  form?: Ref<FormContext<BillsFormFilter, BillsFormFilter>>
  formId?: string
  queryVariables: Partial<IBillPaginationFilters>
  filter: BillsFormFilter
}

const buildInitialValues = (initialValues: Partial<IBillPaginationFilters>): BillsFormFilter => {
  return {
    tagsFilterType: 'OR',
    dateFilterType: 'period',
    dueYear: dayjs().year(),
    dueMonth: dayjs().month(),
    ...initialValues
  } as BillsFormFilter
}

const makeInitialQueryVariables = (): Partial<IBillPaginationFilters> => ({
  isPaid: 'undefined',
  startDueDate: dayjs().startOf('day').toISOString(),
})

export const useBillsFilterStore = defineStore('bills-filter-store', {
  state: (): States => ({
    filter: {
      dateFilterType: 'month',
      isPaid: 'undefined',
      tagsFilterType: 'OR',
      dueDate: undefined,
      dueMonth: undefined,
      dueYear: undefined,
      endDueDate: undefined,
      recipient: undefined,
      installment: undefined,
      startDueDate: undefined,
      paymentMethod: undefined,
      tags: [],
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
          if(values.dateFilterType === 'no-period') {
            return undefined
          }

          if(values.dateFilterType === 'month' && values.dueMonth !== undefined && values.dueYear !== undefined) {
            return dayjs().set('month', values.dueMonth).set('year', values.dueYear).endOf('month').toString()
          }

          return values.dateFilterType === 'day'
            ? values.dueDate
            : values.endDueDate
        }

        const getStartDueDate = () => {
          if(values.dateFilterType === 'no-period') {
            return undefined
          }

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
          paymentMethod: values.paymentMethod,
          installment: values.installment,
          tags: values.tags,
          tagsFilterType: values.tagsFilterType,
        }
      })
    },
    resetQueryVariables() {
      this.queryVariables = makeInitialQueryVariables()
    }
  },
})
