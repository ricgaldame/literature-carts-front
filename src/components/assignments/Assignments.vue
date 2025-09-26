<template>
  <div
    class="row justify-between"
    :style="{
      width: '100%',
      height: '100%',
      padding: `${containerScreenWidth}px`,
    }"
    ref="containerScreen"
  >
    <div
      v-if="$q.screen.lt.sm"
      class="row justify-center"
      style="width: 100%;"
    >
      <q-select
        dense
        outlined
        bg-color="white"
        v-model="day"
        type="text"
        label="Día"
        :style="{
          width: '100%', 
          marginTop: '10px',
          marginBottom: '10px',
          padding: '0px'
        }"
        :options="days"
        option-value="id"
        :option-label="view == 'assignments' ? 'date' : 'name'"
        behavior="menu"
      >
        <template v-slot:prepend>
          <q-icon name="calendar_today" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Sin resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div 
      class="column justify-center items-start"
      :style="{ 
        width: `${hoursWith}px`,
        marginRight: `${hoursMarginRight}px`,
      }"
    >
      <AssignmentsTitles 
        :title="'Horas'" 
        :titlesHeight="titlesHeight"
      />
      <AssignmentsHours 
        v-for="hour in hours" 
        :key="hour"
        :hour="hour" 
        :hoursHeight="hoursHeight"
      />
    </div>
    <template v-if="!$q.screen.lt.sm">
      <div
        v-for="day in days"
        :key="day.name" 
        class="column justify-center items-start"
        :style="{ 
          width: `${availableScreenWidth/days.length - 5}px`,
        }"
      >
        <AssignmentsTitles 
          :title="view == 'assignments' ? day.date : day.name" 
          :titlesHeight="titlesHeight"
        />
        <AssignmentsDaysWeek 
          :availableScreenHeight="availableScreenHeight"
        />
        
      </div>
    </template>
    <template v-else>
      <div
        class="column justify-center items-start"
        :style="{ 
          width: `${availableScreenWidth}px`,
        }"
      >
        <AssignmentsTitles 
          :title="view == 'assignments' ? day.date : day.name" 
          :titlesHeight="titlesHeight"
        />
        <AssignmentsDaysWeek 
          :availableScreenHeight="availableScreenHeight"
        />
        
      </div>
    </template>
    
  </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import AssignmentsTitles from 'src/components/assignments/AssignmentsTitles.vue';
import AssignmentsHours from 'src/components/assignments/AssignmentsHours.vue';
import AssignmentsDaysWeek from 'src/components/assignments/AssignmentsDaysWeek.vue';

export default defineComponent({
  name: 'AssignmentsComponent',
  emits: ['update-nav-bar'],
  components: {
		AssignmentsTitles,
    AssignmentsHours,
    AssignmentsDaysWeek
  },
  props: {
    view: {
			type: String,
			required: true
		},
  },
  data(){
    return {
      hoursWith: 60,
      hoursHeight: 26,
      titlesHeight: 30,
      containerScreenWidth: 10,
      hoursMarginRight: 10
    }
  },
  setup(){
    const containerScreen = ref<HTMLElement | null>(null);
    const availableScreenWidth = ref(0);
    const availableScreenHeight = ref(0);
    const day: any = ref({
      id: 0,
      name: 'Lunes',
      date: ''
    });
    const days: any = ref([]);

    return {
      hours: Array.from({ length: 25 }, (_, i) => i ),
      containerScreen,
      availableScreenWidth,
      availableScreenHeight,
      day,
      days
    }
  },
  async mounted(){
    // console.log( this.getToken, this.getAttributes, this.getRefreshToken);
    this.$emit('update-nav-bar', {});

    this.days = this.getCurrentWeekDays();

    this.updateScreenWidth();
    window.addEventListener('resize', this.updateScreenWidth);

    this.updateScreenHeight();
    window.addEventListener('resize', this.updateScreenHeight);

  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScreenWidth);
    window.removeEventListener('resize', this.updateScreenHeight);
  },
  methods:{
    updateScreenWidth() {
      if (this.containerScreen) {
        this.availableScreenWidth = this.containerScreen.getBoundingClientRect().width - this.hoursWith - this.containerScreenWidth*2 - this.hoursMarginRight;
        // alternativamente: container.value.offsetWidth
      }
    },
    updateScreenHeight() {
      if (this.containerScreen) {
        this.availableScreenHeight = this.containerScreen.getBoundingClientRect().height - this.titlesHeight - this.containerScreenWidth*2;
        this.hoursHeight = this.availableScreenHeight/this.hours.length;
        // alternativamente: container.value.offsetHeight
      }
    },
    getCurrentWeekDays() {
      const today = new Date()
      const currentDay = today.getDay() // 0 = domingo, 1 = lunes, ...
      
      // Ajustar para que la semana empiece en Lunes
      const diffToMonday = (currentDay + 6) % 7
      const monday = new Date(today)
      monday.setDate(today.getDate() - diffToMonday)

      const days = [
        { id: 0, name: 'Lunes', date: '' },
        { id: 1, name: 'Martes', date: '' },
        { id: 2, name: 'Miércoles', date: '' },
        { id: 3, name: 'Jueves', date: '' },
        { id: 4, name: 'Viernes', date: '' },
        { id: 5, name: 'Sábado', date: '' },
        { id: 6, name: 'Domingo', date: '' },
      ]

      if(this.view == 'assignments'){
        return days.map((d, i) => {
          const date = new Date(monday) // copiar referencia
          date.setDate(monday.getDate() + i)

          return {
            ...d,
            date: date.toISOString().split('T')[0] // formato YYYY-MM-DD
          }
        })
      }
      else return days;
    }
  }
});
</script>
