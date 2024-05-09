<template>
  <div class="d-flex">
    <v-select
      v-if="specificDateRange"
      :disabled="disabled"
      :items="options"
      :label="label"
      :value="selectedOption"
      @change="onChangeOption"
    >
    </v-select>
    <v-text-field
      :disabled="disabled || selectedOption !== 'custom'"
      :required="required"
      :rules="rules"
      type="date"
      :value="
        selectedOption === 'custom' && value && value[1] ? value[1] : null
      "
      @input="v => $emit('input', v ? ['custom', v, v] : ['custom'])"
    >
    </v-text-field>
  </div>
</template>

<script>
import fieldsProps from "../../../form/fieldsProps";

// StudyDate should be a select between:
// any date → ““
// today → “yyyymmdd-yyyymmdd” where yyyymmdd are year, month and day of today
// yesterday →  “yyyymmdd-yyyymmdd” where yyyymmdd are year, month and day of yesterday
// last 7 days  → “yyyymmdd-(yyyymmdd-7d)” where yyyymmdd are year, month and day of today and the second date is 7 days before
// last 31 days → same as last 7 days but 31 days before
// last 3 months → same as last 7 days but 3 months before
// last year → same as last 7 days but y year before
// specificDate → date selector and the string should be like “yyyymmdd-yyyymmdd”
const options = [
  { text: "specific date", value: "custom" },
  { text: "today", value: "today" },
  { text: "yesterday", value: "yesterday" },
  { text: "last 7 days", value: "today-7d" },
  { text: "last 31 days", value: "today-31d" },
  { text: "last 3 months", value: "today-3m" },
  { text: "last year", value: "today-1y" }
];

const todayMinusDays = days => {
  const dateOffset = 24 * 60 * 60 * 1000 * days;
  const now = new Date();
  return new Date(now.setTime(now.getTime() - dateOffset));
};

const todayMinusMonths = months => {
  const now = new Date();
  return new Date(now.setMonth(now.getMonth() - months));
};

const todayMinusYears = years => {
  const now = new Date();
  return new Date(now.setFullYear(now.getFullYear() - years));
};

const format = date => date.toISOString().split("T")[0];

export default {
  name: "InputStudyDate",
  props: {
    ...fieldsProps,
    specificDateRange: { default: true, type: Boolean }
  },
  data() {
    return {
      selectedOption: this.value && this.value[0] ? this.value[0] : "custom",
      options
    };
  },
  methods: {
    onChangeOption(option) {
      this.selectedOption = option;

      if (option === "custom") {
        this.$emit("input", [option]);
      } else {
        const today = format(new Date());

        let value;
        switch (option) {
          case "today":
            value = [today, today];
            break;

          case "yesterday": {
            const yesterday = format(todayMinusDays(1));
            value = [yesterday, yesterday];
            break;
          }

          case "today-7d":
            value = [today, format(todayMinusDays(7))];
            break;

          case "today-31d":
            value = [today, format(todayMinusDays(31))];
            break;

          case "today-3m":
            value = [today, format(todayMinusMonths(3))];
            break;

          case "today-1y":
            value = [today, format(todayMinusYears(1))];
            break;
        }
        this.$emit("input", [option, ...value]);
      }
    }
  }
};
</script>
