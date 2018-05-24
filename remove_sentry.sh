usage() { echo "Usage: $0 -i ilogin " 1>&2; exit 1; }

while getopts ":i:" o; do
    case "${o}" in
        i)
            i=${OPTARG}
             ;;
    esac
done
shift $((OPTIND-1))

if [ -z "${i}" ]; then
    usage
fi

echo "ilogin = ${i}"

sqlite3 database/database.sqlite "delete from sentries where login = '${i}'"

echo "${i} is no longer in Sentry"

sqlite3 database/database.sqlite "select login, first_name, last_name, feature, access_mode from sentries where login = '${i}'"

