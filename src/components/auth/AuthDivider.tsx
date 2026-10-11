const AuthDivider: React.FC = () => {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground uppercase tracking-wide">o</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
};

export default AuthDivider;
