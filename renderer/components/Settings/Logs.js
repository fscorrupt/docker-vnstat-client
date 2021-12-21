import { ipcRenderer } from "electron";
import { useVirtual } from "react-virtual";

import { useState, useEffect, useRef } from "react";

import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Button,
	IconButton,
	Box,
	Tooltip,
	Flex,
	Spinner,
	HStack,
	Stack,
	Input,
	InputRightElement,
	InputGroup,
} from "@chakra-ui/react";

import {
	HiTrash,
	HiRefresh,
	HiOutlineInformationCircle,
	HiSearch,
	HiX,
} from "react-icons/hi";
import { useLogs } from "../../context/logs";
import { BiFemale } from "react-icons/bi";

function Logs() {
	const { logs, GetLogs, ClearLogs, isLoading } = useLogs();

	const [search, setSearch] = useState({ bool: false, value: "" });

	useEffect(() => GetLogs(), []);

	// useEffect(() => console.log("search update to", search), [search]); // For Debugging
	// useEffect(() => console.log("logs update to", logs), [logs]); // For Debugging

	return (
		<>
			{logs?.lines.length > 150 && (
				<LogAlert
					status={logs?.lines.lenghth < 400 ? "warning" : "error"}
					content={`You have ${logs?.lines.length} message, We suggest you clear it for better performance.`}
				/>
			)}
			<Flex w='full' justify='space-between' my={3}>
				<Tooltip
					hasArrow
					placement='right'
					label={`Logs stored in ${logs.path}`}>
					<IconButton
						variant='ghost'
						cursor='default'
						icon={<HiOutlineInformationCircle size='1.3em' />}
					/>
				</Tooltip>

				<HStack justify='end' spacing={3}>
					{search.bool ? (
						<InputGroup w='300px'>
							<Input
								placeholder='Search'
								variant='filled'
								value={search.value}
								onChange={(e) =>
									setSearch({ ...search, value: e.target.value })
								}
							/>
							<InputRightElement>
								{search.value ? (
									<IconButton
										variant='none'
										icon={<HiX size='1.4em' />}
										onClick={() => setSearch({ ...search, value: "" })}
									/>
								) : (
									<IconButton
										variant='none'
										icon={<HiSearch size='1.4em' />}
										onClick={() => setSearch({ ...search, bool: !search.bool })}
									/>
								)}
							</InputRightElement>
						</InputGroup>
					) : (
						<Tooltip label='Search in logs'>
							<IconButton
								variant='ghost'
								icon={<HiSearch size='1.4em' />}
								onClick={() => setSearch({ ...search, bool: !search.bool })}
							/>
						</Tooltip>
					)}

					<Button leftIcon={<HiRefresh />} onClick={() => GetLogs()}>
						Refresh
					</Button>
					<Button
						leftIcon={<HiTrash />}
						colorScheme='red'
						onClick={() => ClearLogs()}>
						Clear All
					</Button>
				</HStack>
			</Flex>
			<Stack spacing={1}>
				{isLoading ? (
					<Flex my={3} w='full' h='full' align='center' justify='center'>
						<Spinner size='xl' color='green' />
					</Flex>
				) : logs?.lines.length <= 0 ? (
					<div>No logs found</div>
				) : (
					<>
						<RowVirtualizerDynamic data={logs?.lines} />
					</>
				)}
			</Stack>
		</>
	);
}
// logs?.lines.map((msg) => {
// 	if (
// 		search.bool &&
// 		msg.content.toLowerCase().search(search.value.toLowerCase()) ===
// 			-1
// 	)
// 		return;
// 	return (
// 		<LogAlert
// 			date={msg.date}
// 			status={msg.status === "warn" ? "warning" : alert.status}
// 			content={msg.content}
// 		/>
// 	);
// })

function LogAlert({ status, date, content }) {
	return (
		<Alert status={status}>
			<AlertIcon />
			<Box flex={1}>
				<AlertTitle mr={2}>{date}</AlertTitle>{" "}
				<AlertDescription>{content}</AlertDescription>
			</Box>
		</Alert>
	);
}

function RowVirtualizerDynamic({ data }) {
	const parentRef = useRef();

	const rowVirtualizer = useVirtual({
		size: data.length,
		parentRef,
	});

	return (
		<>
			<Box w='full' h='full'>
				<Stack
					ref={parentRef}
					className='List'
					width='100%'
					position='relative'>
					{rowVirtualizer.virtualItems.map((virtualRow) => (
						<LogAlert
							status={data[virtualRow.index]?.status}
							date={data[virtualRow.index]?.date}
							content={data[virtualRow.index]?.content}
						/>
					))}
				</Stack>
			</Box>
		</>
	);
}

export default Logs;
