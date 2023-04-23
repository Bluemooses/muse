import { type NextPage } from "next";
import Head from "next/head";
import { RouterOutputs, api } from "~/utils/api";
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import { number } from "zod";

const CreatePostWizard = () => {
  const { user } = useUser();
  console.log(user?.id);
  if (!user) return null;
  return (
    <div className="flex w-full gap-3">
      <img
        className="h-12 w-12 rounded-full"
        src={user.profileImageUrl}
        alt="User profile image"
      />
      <input
        className="bg-transparent outline-none"
        placeholder="Type some stuff"
      ></input>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="border-b border-slate-400 p-8" key={post.id}>
      <img src={author?.profileImageUrl} className="h-12 w-12 rounded-full" />
      <div className="flex flex-col">
        <div className="flex">
          <span>{author?.username}</span>
        </div>
        {post.content}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (!data) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Muse</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center ">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {user.isSignedIn && (
              <>
                <CreatePostWizard />
                <SignOutButton />
              </>
            )}
          </div>

          <div className="flex flex-col">
            {[...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
