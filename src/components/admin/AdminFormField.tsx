interface Props {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export default function AdminFormField({ label, required, hint, error, children }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#6E7B66", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#C0392B", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 12, color: "#97A78D", marginTop: 4 }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: "#C0392B", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid #D0D9CA", borderRadius: 10,
  fontSize: 14, background: "#fff", color: "#283325", outline: "none", boxSizing: "border-box",
};

export const textareaStyle: React.CSSProperties = {
  ...{ width: "100%", padding: "10px 14px", border: "1px solid #D0D9CA", borderRadius: 10, fontSize: 14, background: "#fff", color: "#283325", outline: "none", boxSizing: "border-box" },
  minHeight: 80, resize: "vertical",
};

export const selectStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid #D0D9CA", borderRadius: 10,
  fontSize: 14, background: "#fff", color: "#283325", outline: "none",
};
