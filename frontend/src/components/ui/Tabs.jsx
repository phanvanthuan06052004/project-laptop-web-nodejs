import React, { useState } from "react"
import { cn } from "~/lib/utils"

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  const childrenArray = React.Children.toArray(children)

  // Tách TabsList, TabsTrigger, TabsContent từ children
  const list = childrenArray.find(child => child.type === TabsList)
  const contents = childrenArray.filter(child => child.type === TabsContent)

  return (
    <div>
      {React.cloneElement(list, { activeTab, setActiveTab })}
      {contents.map(content =>
        React.cloneElement(content, { activeTab })
      )}
    </div>
  )
}

export const TabsList = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => {
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground"
      )}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, activeTab, children }) => {
  if (activeTab !== value) return null
  return <div className="mt-2">{children}</div>
}
