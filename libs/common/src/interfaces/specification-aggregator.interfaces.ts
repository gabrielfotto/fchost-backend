export interface ISpecificationAggregator<T, R = null> {
	execute(data: T): Promise<R | null>
}
