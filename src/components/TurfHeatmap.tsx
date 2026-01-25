export default function TurfHeatmap() {
  const slots = ['6-7', '7-8', '8-9', '9-10'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Availability Heatmap</h3>

      <div className="grid grid-cols-5 gap-3 text-sm">
        <div></div>
        {slots.map(s => <div key={s}>{s}</div>)}

        {['Green Field', 'Sky Sports'].map(turf => (
          <>
            <div key={turf}>{turf}</div>
            {slots.map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded ${
                  i === 0 ? 'bg-green-500' :
                  i === 1 ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}
              />
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
