{polymer_ext} = require 'libs_frontend/polymer_utils'
{load_css_file} = require 'libs_frontend/content_script_utils'
{cfy} = require 'cfy'
swal = require 'sweetalert' 


polymer_ext {
  is: 'options-view'
  properties: {
    selected_tab_idx: {
      type: Number
      value: 0
    }
    selected_tab_name: {
      type: String
      computed: 'compute_selected_tab_name(selected_tab_idx)'
      observer: 'selected_tab_name_changed'
    }
  }
  listeners: {
    goal_changed: 'on_goal_changed'
  }
  set_selected_tab_by_name: (selected_tab_name) ->
    selected_tab_idx = ['results', 'goals', 'interventions'].indexOf(selected_tab_name)
    if selected_tab_idx != -1
      this.selected_tab_idx = selected_tab_idx
  compute_selected_tab_name: (selected_tab_idx) ->
    return ['results', 'goals', 'interventions'][selected_tab_idx]
  selected_tab_name_changed: (selected_tab_name) ->
    this.fire 'options_selected_tab_changed', {selected_tab_name}
  on_goal_changed: (evt) ->
    this.$$('#options-interventions').on_goal_changed(evt.detail)
    this.$$('#dashboard-view').on_goal_changed(evt.detail)
  icon_clicked: cfy ->*
    
    console.log \icon_clicked
    yield load_css_file('bower_components/sweetalert/dist/sweetalert.css')
    swal {'title':"Welcome to HabitLab!", 'text': "HabitLab is a Chrome Extension that will help prevent you from getting distracted on the web. \n\n
          You will see an icon on every intervention inserted on your page, so you can tell which page elements are from HabitLab. When an intervention is active, you can click the icon to get more information about the intervention, or easily disable it.\n\n
          In order to optimize the interventions shown to you, HabitLab needs to modify the webpages you visit and send data to our server about when you see and respond to those interventions.\n\n
          Click the info icon in the top right to see this window again. Best of luck achieving your internet goals!
          ", 'animation': false}
  #ready: ->
  #  self = this
  #  self.once_available '#optionstab', ->
  #    self.S('#optionstab').prop('selected', 0)
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
