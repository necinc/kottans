FILES=$(find . -maxdepth 1 -type f)

rm -rf src

for fn in $FILES; do
    echo "$fn will be removed";
    rm $fn;
done

mv ./build/* .
rm -d ./build
