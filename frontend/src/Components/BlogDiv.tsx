interface BlogDivProps {
  title: string;
  content: string;
  authorName: string;
}

const BlogDiv = ({ title, content, authorName }: BlogDivProps) => {
  return (
    <div className="flex flex-col pl-4 gap-2 my-2">
      <div className="flex gap-2 items-center mt-2">
        <Avatar authorName={authorName} />
        <div className="text-slate-800 text-lg font-semibold ">{authorName == null ? "Blablabla" : authorName} </div>
        <div className="font-thin">04 March 2025</div>
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-lg">{title}</div>
        <div>
          {content.length > 100 ? content.slice(0, 100) + "...." : content}
        </div>
      </div>

      <div className="text-slate-500 text-sm font-thin mb-2">
        {Math.ceil(content.length / 100)} minute(s) read
      </div>
      <div className="w-full border-b border-slate-200 "></div>
    </div>
  );
};

function Avatar({ authorName }: { authorName: string }) {
  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-600 rounded-full dark:bg-gray-600">
      <span className="font-medium text-gray-200 dark:text-gray-300">
        {authorName[0]}
      </span>
    </div>
  );
}

export default BlogDiv;
