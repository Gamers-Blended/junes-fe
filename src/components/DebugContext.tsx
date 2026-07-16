import React, { createContext, useContext, useState, useMemo } from "react";

interface DebugContextType {
  debugDate: Date | null;
  setDebugDate: (date: Date | null) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [debugDate, setDebugDate] = useState<Date | null>(null);

  // Memoize so consumers don't re-render on every provider render
  const value = useMemo(() => ({ debugDate, setDebugDate }), [debugDate]);

  return (
    <DebugContext.Provider value={value}>{children}</DebugContext.Provider>
  );
};

export const useDebug = (): DebugContextType => {
  const ctx = useContext(DebugContext);
  if (!ctx) {
    throw new Error("useDebug must be used within a DebugProvider");
  }

  return ctx;
};
