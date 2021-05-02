<script lang="ts">
  import CheckCircleIcon from 'svelte-feather-icons/src/icons/CheckCircleIcon.svelte'
  import Button from '../components/buttons/Button.svelte'
  import FABCreate from '../components/buttons/FABCreate.svelte'
  import FABRemove from '../components/buttons/FABRemove.svelte'
  import Checkbox from '../components/forms/Checkbox.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import {
    getPermissions,
    getSharedPermissions,
    removePermission,
    savePermission,
    settings,
    user,
  } from '../firebase'
  import type { SharedPermission } from '../types'

  export let location = ''

  const defaultPermission: SharedPermission = {
    uid: $user?.uid || '',
    email: '',
    read: true,
    write: false,
  }

  let nameRef: HTMLInputElement

  let isRemoving = false

  let showBottomSheet = false

  let currentPermission: SharedPermission = defaultPermission

  let errors: string[] = []

  $: activeIsOwned = currentPermission.uid === $user?.uid

  $: bottomSheetHeader = activeIsOwned
    ? 'Share my account'
    : 'Use shared account'

  let permissions = getPermissions()

  $: sharedPermissions = getSharedPermissions()

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')

    setTimeout(() => nameRef?.focus())
  } else {
    document.body.classList.remove('bottomsheet-open')

    setTimeout(resetBottomSheet, 100)
  }

  function resetBottomSheet() {
    errors = []
    currentPermission = { ...defaultPermission }
    showBottomSheet = false
  }

  function onClickAdd() {
    showBottomSheet = true
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function setActive(permission: SharedPermission) {
    currentPermission = { ...permission }
    showBottomSheet = true
  }

  function save() {
    if (currentPermission.email.trim() === '') {
      errors = ['* email is required']
    } else {
      savePermission(currentPermission)

      showBottomSheet = false
    }
  }

  function useAccount() {
    showBottomSheet = false

    settings.update((s) => ({ ...s, activePermission: currentPermission }))
  }
</script>

<div class="wrapper">
  <div class="content">
    <Header>Account Sharing</Header>
    <h4>Users I'm sharing with</h4>
    <List
      docs={permissions}
      emptyMessage={''}
      keyField="email"
      getName={(item) => item.email}
      removing={isRemoving}
      onRemove={removePermission}
      onClick={setActive}
    />
    <h4>Users sharing with me</h4>
    <List
      docs={sharedPermissions}
      emptyMessage={''}
      keyField="email"
      getName={(item) => item.email}
      onClick={setActive}
    />
  </div>
</div>

<FABPanel>
  <FABRemove on:click={onClickRemove} {isRemoving} />
  <FABCreate on:click={onClickAdd} />
</FABPanel>

<BottomSheet heading={bottomSheetHeader} bind:open={showBottomSheet}>
  <div class="bottom-sheet">
    {#if activeIsOwned}
      {#if errors.length > 0}
        <Errors {errors} />
      {/if}
      {#if currentPermission}
        <Input
          placeholder="email *"
          bind:ref={nameRef}
          bind:value={currentPermission.email}
        />
        <Checkbox bind:checked={currentPermission.read} disabled>
          Permission to view my data
        </Checkbox>
        <Checkbox bind:checked={currentPermission.write}>
          Permission to edit my data
        </Checkbox>
        <div class="button">
          <Button on:click={save}>Save</Button>
        </div>
      {/if}
    {:else}
      <div>
        <b>{currentPermission.email}</b> has shared their account
      </div>
      <div class="permissions">
        {#if currentPermission.read}
          <div class="permission">
            <CheckCircleIcon size="16" /> You have permission to read their account
            data
          </div>
        {/if}
        {#if currentPermission.write}
          <div class="permission">
            <CheckCircleIcon size="16" /> You have permission to edit their account
            data
          </div>
        {/if}
      </div>
      <div class="button">
        <Button on:click={useAccount}>Use Account</Button>
      </div>
    {/if}
  </div>
</BottomSheet>

<style>
  .wrapper {
    overflow-x: hidden;
  }

  .content {
    transition: 0.2s all ease-out;
  }

  h4 {
    text-align: center;
  }

  .permissions {
    padding: 24px 0;
  }

  .permission {
    align-items: center;
    display: flex;
    margin: 0;
    padding: 12px 0;
  }

  .permission :global(svg) {
    stroke: var(--primary-color);
    margin-right: 12px;
  }

  .button {
    margin-top: 24px;
  }
</style>
