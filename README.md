<h2>Work In Progress</h2>
<p>
  This fork is for working through issues that I identify while BootstrapVue progresses towards Vue 3 compatibility. This is to say that updates to this branch are only to components that I use and may contain small customizations that make sense for my use but not the library as a whole.
</p>

<p>My plan will be to merge (if appropriate) and/or assist @xanf when he is safely able to return his focus to BootstrapVue.</p> 

<p>The following are the only components that I am directly using from BootstrapVue:</p>
<ul>
  <li>BAlert</li>
  <li>BCollapse</li>
  <li>BDropdown</li>
  <li>BDropdownItemButton</li>
  <li>BDropdownItem</li>
  <li>BFormCheckbox</li>
  <li>BFormCheckboxGroup</li>
  <li>BFormDatepicker</li>
  <li>BFormRadio</li>
  <li>BFormRadioGroup</li>
  <li>BFormSpinbutton</li>
  <li>BFormTimepicker</li>
  <li>BSidebar</li>
</ul>

<h2>Highlights</h2>

<p>Replaced instances of beforeDestroy() to beforeUnmount()</p>

<p>To work around `INSTANCE_EVENT_EMITTER` issues, I use an emitter prop (when necessary) to pass a custom emitter library and use instead of listening for $on, $once, $off. In some cases it is necessary to add a uuid to to ensure the component is only responding to specific events. <b>This emitter likely should just be built directly into BootstrapVue.</b></p>

<p>To work around `V_FOR_REF` issues, I have implemented a the following strategy for <a href="https://docs.w3cub.com/vue~3/guide/migration/array-refs">b-time</a>. This likely would work for other instances of this in b-tabs and mixin-tbody-row.</p>

<p>There are slight customizations to b-button to accept prop:aria-disabled directly (rather than derived from prop:disabled). I no longer use this component so will at some point return this to the base branch version.</p>