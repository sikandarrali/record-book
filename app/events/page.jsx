import PageContainer from "@/components/providers/PageContainer";

const page = () => {
	return (
		<PageContainer>
			<h2 className="text-2xl font-semibold sticky top-12 bg-white pb-4">
				Sikandar Ki Mehndi
			</h2>

			<div className="flex flex-col gap-2 pb-24">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
					<SingleItem data={item} key={item} />
				))}
			</div>
		</PageContainer>
	);
};

export default page;

const SingleItem = ({ data }) => {
	return <div className="bg-muted p-4">{data}</div>;
};
