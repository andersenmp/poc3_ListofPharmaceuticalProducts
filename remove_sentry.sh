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

sqlite3 database.sqlite "delete from Sentries where login = '${i}'"

echo "${i} is no longer in Sentry"

sqlite3 database.sqlite "select login, firstName, lastName, feature, access_mode from Sentries where login = '${i}'"

