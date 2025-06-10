<template>
  <view class="dh-field ">
    <view class="van-hairline--bottom">
		<view class="input-class" @click="showPopu(false)">
			<u-input
				v-model="resultLabel"
				readonly
				inputAlign="right"
				border="none"
				suffixIcon="arrow-right"
				suffixIconStyle="color:#174E97"
				:placeholder="placeholder"
				placeholderStyle="color:#174E97"
				class="dh-cell"
			/>
		</view>	
    <u-popup :show="show" mode="bottom" round="10" :closeOnClickOverlay="true">
      <view class="van-picker__toolbar">
        <u-button type="button" class="van-picker__cancel" @click="cancel">取消</u-button>
        <view class="van-ellipsis van-picker__title">
					<!-- {{$attrs.label}} -->
					<text v-if="max">(最多选{{max}}个)</text>
				</view>
        <u-button type="button" class="van-picker__confirm" @click="onConfirm">确认</u-button>
      </view>
      <view class="checkbox-con"  style="max-height:264px;overflow-y:auto;position:relative">
          <u-empty description="暂无数据" v-if="columnsData.length == 0" />
          <u-input v-model="searchVal"  placeholder="搜索" @input="search" v-if="isSearch" input-align="left"/>
          <u-cell title="全选" v-if="!max && columnsData.length > 0">
            <template #right-icon>
                <u-checkbox name="all" @click="toggleAll"  v-model="checkedAll" shape="circle" />
              </template>
          </u-cell>
          <u-cell title="不包含" v-if="noIncludeOption">
            <template #right-icon>
                <u-checkbox name="00" @click="unToggleAll"  v-model="unCheckedAll"  shape="circle" />
              </template>
          </u-cell>

        <u-checkbox-group :max="max" v-model="checkboxValue" @change="change" ref="checkboxGroup">
          <u-cell-group>
            <u-cell
              v-for="(item, index) in columnsData"
              clickable
              :key="item[option.value]"
              :title="item[option.label]"
              @click="toggle(index,item)"
            >
              <template #right-icon>
                <u-checkbox :name="item[option.value]" ref="checkboxes" shape="circle" />
              </template>
            </u-cell>
          </u-cell-group>
        </u-checkbox-group>
      </view>
    </u-popup>
    </view>
  </view>
</template>

<script>
export default {
	options: {
		styleIsolation: 'shared'
	},
  name: 'UFieldCheckbox',
  model: {
    prop: 'selectValue'
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    selectValue: {
      type: Array,
      default: function () {
        return []
      }
    },
    option: {
      type: Object,
      default: function () {
        return { label: 'name', value: 'code' }
      }
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    max: { // 最大可选
      type: [Number, String],
      default: 0
    },
    noIncludeOption: { // 是否有不包含选项
      type: Boolean,
      default: false
    }
  },
  computed: {
    resultLabel: {
      get () {
        var columns = JSON.parse(JSON.stringify(this.columns))
        if (this.noIncludeOption) { // 开启不包含
          columns.unshift({ name: '不包含', code: '00' })
        }
        const res = columns.filter(item => {
          return this.resultValue.indexOf(item[this.option.value]) > -1
        })
        const resLabel = res.map(item => {
          return item[this.option.label]
        })
        return resLabel.join(',')
      },
      set () {

      }
    }
  },
  data () {
    return {
      show: false,
      searchVal: '',
      columnsData: JSON.parse(JSON.stringify(this.columns)),
      checkboxValue: JSON.parse(JSON.stringify(this.selectValue)),
      checkedAll: false,
      resultValue: JSON.parse(JSON.stringify(this.selectValue)),
      unCheckedAll: false
    }
  },
  methods: {
    search (val) {
      if (val) {
        this.columnsData = this.columnsData.filter(item => {
          return item[this.option.label].indexOf(val) > -1
        })
      } else {
        this.columnsData = JSON.parse(JSON.stringify(this.columns))
      }
    },
    getData (val) {
      const res = this.columnsData.filter(item => {
        return val.indexOf(item[this.option.value]) > -1
      })
      return res
    },
    onConfirm () {
      this.resultValue = this.checkboxValue
      this.show = !this.show
      this.$emit('confirm', this.resultValue, this.getData(this.resultValue))
    },
    change (val) {
      this.$emit('change', val, this.getData(val))
    },
    cancel () {
      this.show = !this.show
      this.$emit('cancel')
    },
    toggle (index, item) {
      this.unCheckedAll = false
      this.checkboxValue = this.checkboxValue.filter(item => item != '00')
      this.$emit('clickItem', item)
      this.$refs.checkboxes[index].toggle()
    },
    toggleAll (all) { // 全选
      this.unCheckedAll = false
      this.checkboxValue = this.checkboxValue.filter(item => item != '00')
      this.$refs.checkboxGroup.toggleAll(this.checkedAll)
    },
    unToggleAll () { // 不包含
      this.$refs.checkboxGroup.toggleAll(false)
      this.checkboxValue = ['00']
    },
    showPopu (disabled) {
      this.columnsData = JSON.parse(JSON.stringify(this.columns))
      this.checkboxValue = JSON.parse(JSON.stringify(this.selectValue))
      this.resultValue = JSON.parse(JSON.stringify(this.selectValue))
      if (disabled !== undefined && disabled !== false) {
        return false
      } else {
        this.show = !this.show;
        if (this.show) {
            this.$emit('showPopu')
        }
      }
    }
  },
  watch: {
    selectValue: function (newVal) {
      this.resultValue = newVal
    },
    resultValue (val) {
      this.searchVal = ''
      this.columnsData = JSON.parse(JSON.stringify(this.columns))
      this.$emit('input', val)
    },
    columnsData: {
      handler (val) {
        if (val.length && val.length === this.checkboxValue.length) {
          this.checkedAll = true
        } else {
          this.checkedAll = false
        }
      },
      immediate: true
    },
    columns: {
      handler (val) {
        this.columnsData = JSON.parse(JSON.stringify(val))
      },
      immediate: true
    },
    checkboxValue: {
      handler (val) {
        if (val.length && val.length === this.columnsData.length) {
          this.checkedAll = true
        } else {
          if (val.includes('00')) { // 不包含
            this.unCheckedAll = true
          }
          this.checkedAll = false
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
	@import "~@/common/stylus/variable.scss";
	/deep/ .u-popup {
		.van-picker__toolbar {
			height: 44px;
			display: flex;
			align-items: center;
			.u-button {
				width: 60px;
				height: 44px;
				&:first-child {
					color: #a3a3a3 !important;
				};
				&:last-child {
					color: #1e1e1b !important;
				}
			};
			.van-ellipsis {
				flex: 1;
				padding: 0 20px;
				box-sizing: border-box;
				font-weight: 500;
				font-size: 22px;
				text-align: center;
				@include no-wrap();
			}
		}
	}
</style>
