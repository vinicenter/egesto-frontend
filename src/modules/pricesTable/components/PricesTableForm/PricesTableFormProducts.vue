<script setup lang="ts">
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { IPricesTable, PricesTableFormType } from '../../types/pricesTable';
import { FormContext, useFormValues } from 'vee-validate';
import { formatFamilyLabel } from '@/src/modules/products/utils/formatter';
import { getProductMargin, getProductPriceByMargin } from '@/src/modules/pricesTable/utils/product-margin';
import { getFamiliesDefaultCost } from '@/src/modules/families/datasource/families';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import PricesTableRemoveFamily from './menus/remove/PricesTableRemoveFamily.vue';

const props = defineProps<{
  disabled: boolean;
  form: FormContext<PricesTableFormType.Root, PricesTableFormType.Root>;
}>();

const { displayMessage } = useNotify();

const fields = useFormValues<PricesTableFormType.Root>();

const {
  data: familiesDefaultCost,
  isLoading: loadingFamiliesDefaultCost
} = useQuery({
  queryKey: [ 'families-default-costs' ],
  queryFn: getFamiliesDefaultCost,
  onError: () => {
    displayMessage({
      message: 'Erro ao buscar custos padrões das famílias',
      type: 'error'
    })
  }
})

const disabled = computed(() => props.disabled || loadingFamiliesDefaultCost.value)

const setProductMargin = (price: IPricesTable.Price, indexPrice: number, indexFamily: number) => {
  const { grossRevenue, margin, netSales } = getProductMargin(price)

  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.margin`, margin);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.netSales`, netSales);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.grossRevenue`, grossRevenue);
}

const setProductPriceByMargin = (price: IPricesTable.Price, indexPrice: number, indexFamily: number) => {
  try {
    const result = getProductPriceByMargin(price)
    
    const priceFormatted = Number(result.price.toFixed(2))
    
    props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.price`, priceFormatted);
    props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.margin`, result.margin);
    props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.netSales`, result.netSales);
    props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.grossRevenue`, result.grossRevenue);
  } catch (e) {
    const error = e as string;

    displayMessage({
      message: error,
      type: 'error'
    })
  }
}

const setProductDataToPrice = (row: IPricesTable.Price, indexPrice: number, indexFamily: number) => {
  const product = row.product

  const productCost = product?.productionCost?.packCost || 0;
  const expense = (product?.family?.totalCosts + (familiesDefaultCost.value.totalCosts || 0) + (props.form.values.customer?.contractExpenses || 0)) || 0;
  const productionLost = product?.production?.lost || 0;
  const volume = row.volume || 1;
  const price = row.price || 0;

  const tax = props.form.values.costTable?.taxes.reduce((acc, tax) => {
    return acc + (tax.cost || 0);
  }, 0) || 0;

  const productsIdsShipments = props.form.values.costTable?.shipments.products.map((shipment) => shipment.product?._id) || [];

  const shipmentFromCostTableEntries = (productsIdsShipments.includes(product._id)
    ? props.form.values.costTable?.shipments.products.find((shipment) => shipment.product._id === product._id)?.cost
    : props.form.values.costTable?.shipments.families.find((shipment) => shipment.family._id === product.family?._id)?.cost)

  const shipmentForNotDefinedRegisters = props.form.values.costTable?.defaultShipmentCost

  const shipment = shipmentFromCostTableEntries || shipmentForNotDefinedRegisters || 0

  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.shipment`, shipment);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.productCost`, productCost);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.expense`, expense);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.productionLost`, productionLost);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.volume`, volume);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.price`, price);
  props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}.tax`, tax);
}

const syncProduct = (price: IPricesTable.Price, indexPrice: number, indexFamily: number, shouldNotify: boolean) => {
  setProductDataToPrice(price, indexPrice, indexFamily);
  setProductMargin(price, indexPrice, indexFamily);

  if(shouldNotify) {
    displayMessage({
      message: 'Produto sincronizado com a tabela de preço e família',
      type: 'success'
    })
  }
}

const syncAllProducts = () => {
  fields.value.pricesByFamilies?.forEach((family, indexFamily) => {
    family.prices.forEach((price, indexPrice) => {
      syncProduct(price, indexPrice, indexFamily, false)
    })
  })

  displayMessage({
    message: 'Produtos sincronizados com a tabela de preço e família',
    type: 'success'
  })
}

const families = computed(() => fields.value.pricesByFamilies?.map(({ family }) => {
  return {
    title: formatFamilyLabel(family),
    value: family._id
  }
}))

const shouldEnableFamily = (indexFamily: number) => {
  if(!props.form.values?.familyExibition?.length) {
    return true
  }

  const familyId = props.form.values.pricesByFamilies?.[indexFamily]?.family._id!

  return props.form.values.familyExibition.includes(familyId)
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap gap-sm items-center">
      <PricesTableAddFamily
        :disabled="disabled"
        @set-product-data-to-price="setProductDataToPrice"
      />

      <PricesTableAddProduct
        :disabled="disabled"
        :form="form"
        @set-product-data-to-price="setProductDataToPrice"
      />

      <PricesTableBulkChanges
        :form="form"
        :disabled="disabled"
        bulkType="all"
        @set-product-price-by-margin="setProductPriceByMargin"
        @set-product-margin="setProductMargin"
      />

      <VTooltip
        open-on-click
        location="top"
      >
        <template v-slot:activator="{ props }">
          <VBtn
            v-bind="props"
            prepend-icon="mdi-sync"
            :disabled="disabled"
            color="warning"
            @click="syncAllProducts"
          >
            Sincronizar produtos
          </VBtn>
        </template>

        <span>Sincronizar custo do produto, tabela de custo e custos da família de todos os produtos</span>
      </VTooltip>

      <div class="w-300px">
        <ESelect
          multiple
          hide-details
          name="familyExibition"
          label="Filtrar família"
          :disabled="disabled"
          :items="families"
        />
      </div>
    </div>

    <EEditableListItem
      name="pricesByFamilies"
      :disabled="disabled"
      disable-spacer
      disable-add
    >
      <template #default="{ index: indexFamily, item, removeItem }">
        <div v-show="shouldEnableFamily(indexFamily)">
          <VCard class="flex flex-col">
            <VCardTitle>
              {{ formatFamilyLabel(item.family) }}
            </VCardTitle>

            <VContainer>
              <div class="flex flex-wrap gap-sm items-center gap-x-sm">
                <PricesTableAddAllProductsToFamily
                  :disabled="disabled"
                  :family-index="indexFamily"
                  @set-product-data-to-price="setProductDataToPrice"
                />

                <PricesTableAddProduct
                  :disabled="disabled"
                  :form="form"
                  :family-id="item.family._id"
                  @set-product-data-to-price="setProductDataToPrice"
                />

                <PricesTableBulkChanges
                  :form="form"
                  :disabled="disabled"
                  :index-family="indexFamily"
                  bulk-type="family"
                  @set-product-price-by-margin="setProductPriceByMargin"
                  @set-product-margin="setProductMargin"
                />

                <PricesTableRemoveFamily
                  :disabled="disabled"
                  @remove-family="removeItem"
                />
              </div>

              <VDivider class="mt-sm" />

              <EEditableListItem
                :name="`pricesByFamilies.${indexFamily}.prices`"
                class="flex flex-col lg:flex-row space-y-4"
                :disabled="disabled"
                disable-add
              >
                <template #default="{ index: indexPrice, item, removeItem: removeProduct }">
                  <div class="w-300px m-xs space-y-xs">
                    <div>
                      {{ fields.pricesByFamilies?.[indexFamily].prices[indexPrice].product.name }}
                    </div>

                    <div class="flex gap-x-xs">
                      <VTooltip open-on-click>
                        <template v-slot:activator="{ props }">
                          <VBtn
                            v-bind="props" 
                            icon="mdi-sync"
                            color="warning"
                            size="small"
                            :disabled="disabled || !item.product"
                            @click="syncProduct(item, indexPrice, indexFamily, true)"
                          />
                        </template>

                        <span>Sincronizar custo do produto, tabela de custo e custos da família</span>
                      </VTooltip>

                      <PricesTableRemoveProduct
                        @confirm="removeProduct"
                        :disabled="disabled || fields.pricesByFamilies?.[indexFamily].prices.length === 1"
                      />

                      <VTooltip
                        v-if="fields.pricesByFamilies?.[indexFamily].prices[indexPrice].product.code"
                        open-on-click
                      >
                        <template v-slot:activator="{ props }">
                          <VChip
                            v-bind="props"
                            :disabled="disabled"
                          >
                            {{ fields.pricesByFamilies?.[indexFamily].prices[indexPrice].product.code }}
                          </VChip>
                        </template>
    
                        <span>Código do produto</span>
                      </VTooltip>
                    </div>
                  </div>
  
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-xs">
                    <EInputPrice
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.price`"
                      :rules="[required]"
                      :disabled="disabled || !item.product"
                      label="Preço de venda"
                      @update:model-value="setProductMargin(item, indexPrice, indexFamily)"
                    />
  
                    <EInputText
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.volume`"
                      :rules="[required]"
                      :disabled="disabled || !item.product"
                      type="number"
                      label="Volume"
                      @update:model-value="setProductMargin(item, indexPrice, indexFamily)"
                    />
  
                    <EInputPct
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.shipment`"
                      :rules="[required]"
                      :disabled="disabled"
                      label="Frete"
                      @update:model-value="setProductMargin(item, indexPrice, indexFamily)"
                    />
  
                    <EInputPct
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.expense`"
                      :rules="[required]"
                      :disabled="disabled"
                      label="Despesas"
                      @update:model-value="setProductMargin(item, indexPrice, indexFamily)"
                    />
  
                    <EInputPrice
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.productCost`"
                      :rules="[required]" :disabled="disabled || !item.product"
                      label="Custo item"
                      @update:model-value="setProductMargin(item, indexPrice, indexFamily)"
                    />
  
                    <EInputPrice
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.grossRevenue`"
                      :rules="[required]"
                      :disabled="disabled || !item.product"
                      label="Fat. bruto"
                      readonly
                    />
  
                    <EInputPrice
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.netSales`"
                      :rules="[required]"
                      :disabled="disabled || !item.product"
                      label="Fat. liquido"
                      readonly
                    />
  
                    <EInputPct
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.tax`"
                      :rules="[required]"
                      :disabled="disabled"
                      label="Impostos"
                      @update:model-value="setProductMargin(item, indexPrice, indexFamily)"
                    />
  
                    <EInputPct
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.productionLost`"
                      :rules="[required]"
                      :disabled="disabled"
                      label="Perda"
                      @update:model-value="setProductMargin(item, indexPrice, indexFamily)"
                    />
  
                    <EInputPct
                      :name="`pricesByFamilies.${indexFamily}.prices.${indexPrice}.margin`"
                      :rules="[required]"
                      :disabled="disabled || !item.product"
                      label="Margem"
                      @blur="setProductPriceByMargin(item, indexPrice, indexFamily)"
                    />
                  </div>
                </template>
              </EEditableListItem>
            </VContainer>
          </VCard>

          <VDivider />
        </div>
      </template>
    </EEditableListItem>
  </section>
</template>
