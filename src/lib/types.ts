export type ChangeEvent = Event & {
  target: EventTarget & HTMLInputElement
  currentTarget: EventTarget & HTMLInputElement
  checked: boolean
}
