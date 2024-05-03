<script setup lang="ts">
import { useFieldArray, useFormValues } from 'vee-validate';
import { computed } from 'vue';
import { ref } from 'vue';
import { IPricesTable, PricesTableFormType } from '../../../types/pricesTable';
import { getProducts } from '@/src/modules/products/datasource/products';
import { IProduct } from '@/src/modules/products/types/product';
import useNotify from '@/src/core/composables/useNotify';

const props = defineProps<{
  familyIndex: number
  disabled?: boolean
}>()

const dialog = ref(false)

const loading = ref(false)

const { displayMessage } = useNotify()

const { fields, push } = useFieldArray<IPricesTable.Price>(computed(() => `pricesByFamilies.${props.familyIndex}.prices`))
const formValues = useFormValues<PricesTableFormType.Root>()

const emit = defineEmits<{
  (e: 'setProductDataToPrice', row: IPricesTable.Price, indexPrice: number, indexFamily: number): void
}>()

const updateFamilyProducts = async () => {
  const family = formValues.value.pricesByFamilies?.[props.familyIndex]?.family

  if(!family) {
    throw new Error('Family index not found')
  }

  try {
    loading.value = true

    const products = await getProducts({
      limit: 1000,
      page: 1,
      familyId: family._id,
      orderBy: 'name',
      order: 'ASC'
    })

    let count = 0

    products.docs.forEach((product: IProduct.Root) => {
      if(fields.value.find(({ value }) => value?.product?._id === product._id)) {
        return
      }

      const price = {
        product: product,
        expense: 0,
        grossRevenue: 0,
        margin: 0,
        netSales: 0,
        price: 0,
        productCost: 0,
        productionLost: 0,
        shipment: 0,
        tax: 0,
        volume: 1,
      }

      push(price)
      emit('setProductDataToPrice', price, fields.value.length - 1, props.familyIndex)

      count++
    })

    const productLabel = count > 1 ? 'produtos' : 'produto'

    const message = count
      ? `${count} ${productLabel} adicionados com sucesso!`
      : 'Nenhum novo produto encontrado!'

    displayMessage({ message, type: 'success' })

    dialog.value = false
  } catch {
    displayMessage({
      message: 'Erro ao procurar produtos da família!',
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }

}
</script>

<template>
	<VDialog
		v-model="dialog"
		max-width="400"
		persistent
	>
		<template v-slot:activator="{ props }">
      <VTooltip open-on-click location="top">
        <template v-slot:activator="{ props: propsTooltip }">
          <VBtn
            v-bind="{ ...propsTooltip, ...props }"
            prepend-icon="mdi-sync"
            color="primary"
            :disabled="disabled"
          >
            Atualizar produtos da família
          </VBtn>
        </template>

        <span>Adicione os últimos produtos criados na família para dentro da tabela de preço</span>
      </VTooltip>
		</template>

		<VCard
			prepend-icon="mdi-trash-can-outline"
			text="Ao atualizar a lista de produtos da família, os produtos da família que não estão na tabela de preço serão adicionados."
			title="Atualizar a lista de produtos?"
		>
			<template v-slot:actions>
				<v-spacer></v-spacer>

				<VBtn @click="dialog = false">
					Cancelar
				</VBtn>

				<VBtn
          color="primary"
          :loading="loading"
          @click="updateFamilyProducts"
        >
					Atualizar
				</VBtn>
			</template>
		</VCard>
	</VDialog>
</template>
