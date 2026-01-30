const CoverLetter = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div className="text-white">
      CoverLetter: {id}
    </div>
  );
};

export default CoverLetter;
