export type Step = "prerequisites" | "cordlang" | "complete"
export type StatusType = "checking" | "ready" | "installing" | "success" | "error"

export interface InstallationStatus {
  status: StatusType
  step: Step
  message: string
  details: string
}

